import moviepy as mpe
from moviepy.video.fx import *
import captacity
import os
import yt_dlp
import numpy as np
import random
from g4f.client import Client
import assemblyai as aai
from kokoro import KPipeline
from IPython.display import display, Audio
import soundfile as sf
from tiktok import upload_video
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
import functools
import threading
import queue
import sys

# Set UTF-8 encoding for Windows compatibility
if sys.platform.startswith('win'):
    try:
        # Force UTF-8 encoding for stdout/stderr on Windows
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except AttributeError:
        # Python < 3.7 fallback
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, errors='replace')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, errors='replace')
import uuid
import time
from datetime import datetime
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from config import Config
from logger import logger
import signal
import sys

# Initialize Flask app
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

# Setup CORS
CORS(app, resources={r"/*": {"origins": Config.ALLOWED_ORIGINS}})

# Setup rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=[Config.RATE_LIMIT]
)

# Global variables for queue management
task_queue = queue.Queue()
task_status = {}
task_results = {}
task_lock = threading.Lock()

# Thread pool for parallel processing
MAX_WORKERS = int(os.environ.get('MAX_WORKERS', '3'))  # Configurable via environment
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

# Queue worker thread
queue_worker_running = True

def queue_worker():
    """Background worker that processes tasks from the queue"""
    global queue_worker_running
    logger.info("Queue worker started")
    
    while queue_worker_running:
        try:
            # Get task from queue with timeout
            task = task_queue.get(timeout=1)
            if task is None:  # Shutdown signal
                break
                
            task_id = task['task_id']
            logger.info(f"Processing task {task_id}")
            
            # Update task status
            with task_lock:
                task_status[task_id] = {
                    'status': 'processing',
                    'message': 'Task is being processed',
                    'started_at': datetime.now().isoformat()
                }
            
            try:
                # Process the task
                if task['type'] == 'create_video':
                    result = process_create_video_task(task)
                elif task['type'] == 'upload':
                    result = process_upload_task(task)
                else:
                    result = {'success': False, 'error': 'Unknown task type'}
                
                # Store result
                with task_lock:
                    task_status[task_id] = {
                        'status': 'completed',
                        'message': 'Task completed successfully' if result.get('success') else 'Task failed',
                        'completed_at': datetime.now().isoformat()
                    }
                    task_results[task_id] = result
                    
            except Exception as e:
                logger.error(f"Error processing task {task_id}: {str(e)}", exc_info=True)
                with task_lock:
                    task_status[task_id] = {
                        'status': 'failed',
                        'message': f'Task failed: {str(e)}',
                        'failed_at': datetime.now().isoformat()
                    }
                    task_results[task_id] = {'success': False, 'error': str(e)}
            
            finally:
                task_queue.task_done()
                
        except queue.Empty:
            continue
        except Exception as e:
            logger.error(f"Queue worker error: {str(e)}", exc_info=True)
    
    logger.info("Queue worker stopped")

# Start queue worker thread
worker_thread = threading.Thread(target=queue_worker, daemon=True)
worker_thread.start()

def cleanup_old_tasks():
    """Clean up old task data to prevent memory leaks"""
    cutoff_time = time.time() - 3600  # 1 hour ago
    with task_lock:
        tasks_to_remove = []
        for task_id, status in task_status.items():
            # Remove completed/failed tasks older than 1 hour
            if status['status'] in ['completed', 'failed']:
                task_time = datetime.fromisoformat(
                    status.get('completed_at', status.get('failed_at', datetime.now().isoformat()))
                ).timestamp()
                if task_time < cutoff_time:
                    tasks_to_remove.append(task_id)
        
        for task_id in tasks_to_remove:
            task_status.pop(task_id, None)
            task_results.pop(task_id, None)
    
    logger.info(f"Cleaned up {len(tasks_to_remove)} old tasks")

# Cleanup thread
def periodic_cleanup():
    while queue_worker_running:
        time.sleep(1800)  # Clean up every 30 minutes
        cleanup_old_tasks()

cleanup_thread = threading.Thread(target=periodic_cleanup, daemon=True)
cleanup_thread.start()

# Error handlers
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded", "message": str(e.description)}), 429

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
    return jsonify({"error": "Internal server error", "message": str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    queue_size = task_queue.qsize()
    active_tasks = len([s for s in task_status.values() if s['status'] == 'processing'])
    
    return jsonify({
        "status": "healthy",
        "queue_size": queue_size,
        "active_tasks": active_tasks,
        "max_workers": MAX_WORKERS,
        "timestamp": datetime.now().isoformat()
    }), 200

# Task status endpoint
@app.route('/task/<task_id>', methods=['GET'])
def get_task_status(task_id):
    with task_lock:
        if task_id not in task_status:
            return jsonify({'error': 'Task not found'}), 404
        
        status = task_status[task_id].copy()
        if task_id in task_results:
            status['result'] = task_results[task_id]
    
    return jsonify(status), 200

# Middleware to validate request JSON
def validate_json():
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            if request.is_json:
                return f(*args, **kwargs)
            return jsonify({"error": "Content-Type must be application/json"}), 415
        return wrapper
    return decorator

# Constants
VIDEO_DIR = "./Global-Backend/assets/temp"
client = Client()

movieList = [
    "Breaking Bad", "Game of Thrones", "Stranger Things", "The Witcher", "The Boys",
    "The Mandalorian", "Money Heist", "Peaky Blinders", "Narcos", "Dark",
    "The Office", "Friends", "How I Met Your Mother", "Sherlock", "Better Call Saul",
    "House of the Dragon", "The Last of Us", "Loki", "WandaVision", "The Crown",
    "Inception", "Interstellar", "The Dark Knight", "Fight Club", "The Matrix",
    "Pulp Fiction", "Forrest Gump", "The Shawshank Redemption", "Gladiator", "Joker",
    "Parasite", "Avengers: Endgame", "Avengers: Infinity War", "Spider-Man: No Way Home", "Iron Man",
    "Doctor Strange", "Black Panther", "Dune", "Oppenheimer", "The Godfather",
    "The Lord of the Rings", "The Hobbit", "Star Wars", "John Wick", "Deadpool",
    "Mission: Impossible", "Top Gun: Maverick", "The Social Network", "The Big Short", "The Wolf of Wall Street"
]

animeList = [
    "Attack on Titan", "Naruto", "Naruto Shippuden", "One Piece", "Dragon Ball Z",
    "Dragon Ball Super", "Bleach", "Fullmetal Alchemist: Brotherhood", "Fullmetal Alchemist",
    "Death Note", "My Hero Academia", "Hunter x Hunter", "Demon Slayer: Kimetsu no Yaiba",
    "Jujutsu Kaisen", "Sword Art Online", "Tokyo Ghoul", "One Punch Man",
    "Code Geass: Lelouch of the Rebellion", "Steins;Gate", "Cowboy Bebop",
    "Neon Genesis Evangelion", "Mob Psycho 100", "Fairy Tail", "Black Clover",
    "Re:Zero − Starting Life in Another World"
]

SubwayVideoURLs = ['https://youtu.be/N9cyxkdtr4M','https://youtu.be/_4PARS3D6PM?si=0iEGhlTh-m9ZHBQF','https://youtu.be/GO1FzwbtSV4?si=825NUpjXeuLcmNzj']
ProdcastsURLs =["https://youtu.be/3YmxmCg2Xik?si=05mKDwOFr8kQoHIf",'https://youtu.be/F5sD97lw0Dg?si=J6GvM9YtSQiho5TP','https://youtu.be/TQinQLhzhWE?si=27pFEMQiBTJihesR']
MinecraftVideoURLs = ['https://youtu.be/XBIaqOm0RKQ?si=aMZGBYVNZsSbJARx','https://youtu.be/s600FYgI5-s?si=NRitVh7ELOBbFI3w','https://youtu.be/aF828t3G5Gc?si=W0VAELqaHnPPV3Yu','https://youtu.be/R4-d2XBwpaQ?si=cEROKrjmJ6ARzEQD']
RelaxingVideoURLs = ['https://youtu.be/wr868MUcTag?si=QI2ITFT0A8aKkI6O','https://youtu.be/X_ZrBEekL-k?si=a3meDJFxj45C84Zw','https://youtu.be/8Ckne4QCVyo?si=7Bryaw-m3YLS3rDg']

def DeleteTempFiles(task_id=None):
    """Delete temporary files, optionally for a specific task"""
    import time
    import gc
    temp_dir = "./Global-Backend/assets/temp"
    if task_id:
        temp_dir = os.path.join(temp_dir, task_id)
    
    if not os.path.exists(temp_dir):
        return
    
    # Force garbage collection to release any file handles
    gc.collect()
    
    def safe_delete_with_retry(path, max_retries=3, delay=1):
        """Safely delete a file or directory with retry logic"""
        for attempt in range(max_retries):
            try:
                if os.path.isdir(path):
                    import shutil
                    shutil.rmtree(path)
                elif os.path.isfile(path):
                    # Make file writable if it's read-only
                    os.chmod(path, 0o777)
                    os.remove(path)
                return True
            except PermissionError as e:
                if attempt < max_retries - 1:
                    logger.warning(f"Attempt {attempt + 1} failed to delete {os.path.basename(path)}: File in use. Retrying in {delay} seconds...")
                    time.sleep(delay)
                    delay *= 2  # Exponential backoff
                    gc.collect()  # Force garbage collection
                else:
                    # Encode the path safely for logging
                    safe_path = os.path.basename(path).encode('ascii', errors='replace').decode('ascii')
                    logger.error(f"Failed to delete file after {max_retries} attempts: {safe_path} - File may be in use by another process")
            except Exception as e:
                safe_path = os.path.basename(path).encode('ascii', errors='replace').decode('ascii')
                logger.error(f"Unexpected error deleting {safe_path}: {str(e).encode('ascii', errors='replace').decode('ascii')}")
                break
        return False
        
    # Get all items first to avoid directory change during iteration
    try:
        items = os.listdir(temp_dir)
    except Exception as e:
        logger.error(f"Error listing directory {temp_dir}: {e}")
        return
        
    for item in items:
        item_path = os.path.join(temp_dir, item)
        safe_delete_with_retry(item_path)
    
    # Try to remove the task directory itself if it's empty
    if task_id:
        try:
            if not os.listdir(temp_dir):  # Directory is empty
                safe_delete_with_retry(temp_dir)
        except Exception:
            pass  # Directory not empty or other issue, ignore

def create_video(bg_video, font_path, duration, Gen, quality, task_id):
    """Create video with task-specific temp directory"""
    video = None
    audio = None
    temp_dir = None
    final_video = None
    
    # Create task-specific temp directory
    task_temp_dir = os.path.join("./Global-Backend/assets/temp", task_id)
    os.makedirs(task_temp_dir, exist_ok=True)
    
    if bg_video == "SS":
        videoURL = SubwayVideoURLs[random.randint(0, len(SubwayVideoURLs) - 1)]
    elif bg_video == "Minecraft":
        videoURL = MinecraftVideoURLs[random.randint(0, len(MinecraftVideoURLs) - 1)]
    elif bg_video == "Relaxing":
        videoURL = RelaxingVideoURLs[random.randint(0, len(RelaxingVideoURLs) - 1)]

    try:
        # Configure yt-dlp options
        ydl_opts_video = {
            'format': f'bestvideo[height<={quality}]',
            'outtmpl': os.path.join(task_temp_dir, '%(title)s.%(ext)s'),
            'keepvideo': True
        }

        with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo:
            info_video = ydlVideo.extract_info(videoURL, download=True)
            filename_video = ydlVideo.prepare_filename(info_video)
            video = mpe.VideoFileClip(filename_video)
            video = video.with_effects([Resize((470, 840))])
            video = video.subclipped(10, 10 + duration)

            if Gen == "Podcast":
                ydl_opts_audio = {
                    'format': 'bestaudio/best',
                    'extractaudio': True,
                    'audioformat': 'mp3',
                    'outtmpl': os.path.join(task_temp_dir, '%(title)s.%(ext)s'),
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                    'keepvideo': True,
                }
                with yt_dlp.YoutubeDL(ydl_opts_audio) as ydlAudio: 
                    info_audio = ydlAudio.extract_info(ProdcastsURLs[random.randint(0, len(ProdcastsURLs) - 1)], download=True)
                    filename_audio = ydlAudio.prepare_filename(info_audio)
                    audio = mpe.AudioFileClip(filename_audio)
                    start = random.randint(0, int(audio.duration - 300))
                    audio = audio.subclipped(start, start + duration)
                    video = video.with_audio(audio)

            elif Gen == "Reddit" or Gen == "Novel":
                Generate_Speech(Gen, task_id)
                filename_audio = os.path.join(task_temp_dir, "complete_speech.mp3")
                audio = mpe.AudioFileClip(filename_audio)
                audio = audio.subclipped(0, duration)
                video = video.with_audio(audio)
                
            elif Gen == "Anime" or Gen == "Movie": 
                ydl_opts_video = {
                    'format': f'bestvideo[height<={quality}]+bestaudio/best',
                    'outtmpl': os.path.join(task_temp_dir, '%(title)s.%(ext)s'),
                    'keepvideo': True
                }
                anime_videos = Get_Content_Anime("", Gen)
                with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo:
                    info_video = ydlVideo.extract_info(anime_videos, download=True)
                    filename_video = ydlVideo.prepare_filename(info_video)
                    anime_video = mpe.VideoFileClip(filename_video)
                    start = random.randint(0, int(anime_video.duration - duration))
                    anime_video = anime_video.subclipped(start, start + duration)
                    anime_video = anime_video.with_effects([Resize((470,300))])
                    video = video.with_effects([Resize((470, 840 - anime_video.h))])
                    anime_video = anime_video.with_position(('center', 0))
                    video = video.with_position(('center', anime_video.h))

                    final_clip = mpe.ColorClip(size=(470, 840), color=(0,0,0), duration=duration)
                    final_clip = mpe.CompositeVideoClip([final_clip, anime_video, video])
                    video = final_clip

            video_output_path = os.path.join(task_temp_dir, "video.mp4" if Gen != "Anime" and Gen != "Movie" else "video1.mp4")
            video.write_videofile(video_output_path)
            
            if Gen != "Anime" and Gen != "Movie":
                logger.info("Adding captions to the video...")
                captacity.add_captions(
                    video_file=video_output_path,
                    output_file=os.path.join(task_temp_dir, "video1.mp4"),
                    use_local_whisper=False,
                    font_size=40,
                    font=font_path,
                    font_color="white",
                    word_highlight_color="green"
                )
            
            logger.info("Video created successfully.")
            return os.path.join(task_temp_dir, "video1.mp4")

    except Exception as e:
        logger.error(f"An error occurred creating video for task {task_id}: {e}")
        raise ValueError("Video could not be downloaded.")

    finally:
        if video is not None:
            video.close()
        if audio is not None:
            audio.close()
        if final_video is not None:
            final_video.close()

def Get_Content(model, source):
    """Get content for Reddit/Novel generation"""
    logger.info(f"Getting {source} content...")
    try:
        tool_calls = [
            {
                "function": {
                    "arguments": {
                        "query": f"Trending {source} Stories",
                        "max_results": 5,
                        "max_words": 5000,
                        "backend": "auto",
                        "add_text": False,
                        "timeout": 5
                    },
                    "name": "search_tool"
                }
            }
        ]
        response = client.chat.completions.create(
            model="sonar-pro",
            provider='PerplexityLabs',
            messages=[
                {"role": "system", "content": f"You are an AI that, when the user says the single word 'go', will do the following:\n\n- Search for the best, most trending story {source}.\n- Return **only** the full story text — **no title, no intro, no summary, no comments, no explanations.**\n- The story must be **at least 1000 words long. This is absolutely required.**\n- If no story meeting this requirement is found, then you must **create an original story** in authentic {source} style that feels real and trending.\n- Output **only** the story — no comments, no disclaimers, no introductions, no formatting, no titles.\n- Do not do anything until the user says exactly: **go**."},
                {"role": "user", "content": "go"}
            ],
            tool_calls=tool_calls
        )
        if response and response.choices and response.choices[0].message.content:
            return response.choices[0].message.content
        raise Exception("No valid response from GPT")
    except Exception as e:
        logger.error(f"Error in Get_Content: {str(e)}")
        fallback_story = """AITA for refusing to let my sister use my wedding venue after she tried to take it from me? I (28F) am getting married next month to my fiancé James (30M). We found this beautiful historic mansion that was perfect for our wedding and booked it immediately. My sister Amy (32F) got engaged two months after us but wanted to get married before us. When she found out about our venue, she tried to convince the owners to let her use it on our date, claiming we had canceled. Fortunately, they contacted us to confirm, and we cleared up the confusion. Now Amy is crying to our family, saying I'm being selfish and should let her have the venue since she's the older sister. Our parents are split - dad supports me, but mom thinks I should "be the bigger person." I refused to budge. AITA? The situation has gotten even more complicated since then. Amy has been posting on social media about how I'm "ruining her dream wedding" and has gotten some of our extended family involved. Some cousins are now refusing to come to my wedding, saying I'm being unfair to Amy. But what really pushed me over the edge was discovering that Amy had actually gone behind my back and tried to contact our vendors, pretending to be me to change the wedding date. I only found out because our photographer called to confirm a date change request. I'm furious and hurt that she would go to such lengths. James is suggesting we hire security for the wedding day, worried that Amy might try to cause a scene. Our mom is still insisting that I should give in to keep the peace, saying "You can find another venue, but you can't find another sister." But I feel like giving in would just enable her manipulative behavior. The whole situation is causing so much stress that it's overshadowing what should be a happy time in our lives. Some of our friends think we should just elope and avoid the drama altogether, but why should we have to compromise our dream wedding because of my sister's unreasonable behavior? AITA for standing my ground?"""
        return fallback_story

def Get_Content_Anime(model, source):
    """Get anime content URLs"""
    anime_list = [
        {
            "series": "Helluva Boss",
            "episodes": [
                {"title": "Murder Family (S1E1)", "url": "https://www.youtube.com/watch?v=el_PChGfJN8"},
                {"title": "Loo Loo Land (S1E2)", "url": "https://www.youtube.com/watch?v=kpnwRg268FQ"},
                {"title": "Spring Broken (S1E3)", "url": "https://www.youtube.com/watch?v=RghsgkZKedg"}
            ]
        },
        {
            "series": "The Amazing Digital Circus",
            "episodes": [
                {"title": "PILOT", "url": "https://www.youtube.com/watch?v=HwAPLk_sQ3w"},
                {"title": "Ep 2: Candy Carrier Chaos!", "url": "https://www.youtube.com/watch?v=4ofJpOEXrZs"},
                {"title": "Ep 3: The Mystery Of Mildenhall Manor", "url": "https://www.youtube.com/watch?v=bKjfw77cxeQ"}
            ]
        },
        {
            "series": "Epithet Erased",
            "episodes": [
                {"title": "EP1 - Quiet in the Museum!", "url": "https://www.youtube.com/watch?v=yio2JNgQKBM"},
                {"title": "EP2 - Bear Trap", "url": "https://www.youtube.com/watch?v=8hIr9H_LMKE"},
                {"title": "EP7 - Winner Take All (Finale)", "url": "https://www.youtube.com/watch?v=CKKSkA2lKF0"}
            ]
        },
        {
            "series": "Murder Drones",
            "episodes": [
                {"title": "Episode 1: PILOT", "url": "https://www.youtube.com/watch?v=mImFz8mkaHo"},
                {"title": "Episode 2: Heartbeat", "url": "https://www.youtube.com/watch?v=7z8DO1KhPFo"},
                {"title": "Episode 3: The Promening", "url": "https://www.youtube.com/watch?v=djsJqNAGMuY"}
            ]
        },
        {
            "series": "Bravest Warriors",
            "episodes": [
                {"title": "Time Slime (S1 Ep1)", "url": "https://www.youtube.com/watch?v=mpDOscUDQ_0"},
                {"title": "Emotion Lord (S1 Ep2)", "url": "https://www.youtube.com/watch?v=58Uk_RzJuBE"},
                {"title": "Lavarinth (S1 Ep6)", "url": "https://www.youtube.com/watch?v=yedxmztthkY"}
            ]
        },
        {
            "series": "Bee and PuppyCat",
            "episodes": [
                {"title": "Food (Ep 1)", "url": "https://www.youtube.com/watch?v=KNs9shgQ2rI"},
                {"title": "Food / Farmer (Ep 1 & 2 combined)", "url": "https://www.youtube.com/watch?v=jKxIC9QHnkM"},
                {"title": "Full episodes (compilation)", "url": "https://www.youtube.com/watch?v=dop4MTlf_zc"}
            ]
        }
    ]
    random_series = random.choice(anime_list)
    random_episode = random.choice(random_series['episodes'])
    logger.info(f"Url Selected: {random_episode['url']}")
    return random_episode['url']

def Generate_Speech(Gen, task_id):
    """Generate speech for Reddit/Novel content"""
    pipeline = KPipeline(lang_code='a')
    text = Get_Content("", "")
    generator = pipeline(text, voice='am_adam')
    
    all_audio = []
    for i, (gs, ps, audio) in enumerate(generator):
        logger.info(f"Processing audio chunk {i}")
        if i == 0:
            display(Audio(data=audio, rate=24000, autoplay=True))
        all_audio.append(audio)
    
    final_audio = np.concatenate(all_audio)
    output_path = os.path.join("./Global-Backend/assets/temp", task_id, "complete_speech.mp3")
    sf.write(output_path, final_audio, 24000)
    return output_path

def process_create_video_task(task):
    """Process create video task"""
    task_id = task['task_id']
    data = task['data']
    
    try:
        bg_video = data.get('bg_video')
        font_path = data.get('font_path', getattr(Config, 'FONT_PATH', 'Bangers-Regular.ttf'))
        duration = data.get('duration')
        gen = data.get('gen')
        quality = data.get('quality', getattr(Config, 'DEFAULT_VIDEO_QUALITY', '720'))
        sessionid = data.get('sessionid')
        dc_id = data.get('dc_id')
        login_name = data.get('login_name')
        title = data.get('title', '')
        schedule = data.get('schedule', 0)
        
        if not all([bg_video, duration, gen]):
            return {'success': False, 'error': 'Missing required parameters'}

        # Create video
        video_path = create_video(bg_video, font_path, duration, gen, quality, task_id)
        
        # Upload if credentials provided
        if all([sessionid, dc_id, login_name]):
            from tiktok_uploader.cookies import save_cookies_to_file
            cookie_file = f"tiktok_session-{login_name}"
            save_cookies_to_file([
                {'name': 'sessionid', 'value': sessionid},
                {'name': 'tt-target-idc', 'value': dc_id}
            ], cookie_file)

            success = upload_video(
                session_user=login_name,
                video=video_path,
                title=title,
                schedule_time= -int(schedule)
            )
            
            if success:
                return {
                    'success': True,
                    'message': 'Video created and uploaded successfully',
                    'video_path': video_path
                }
            else:
                return {
                    'success': False,
                    'error': 'Video upload failed',
                    'video_path': video_path
                }
        else:
            return {
                'success': True,
                'message': 'Video created successfully',
                'video_path': video_path
            }
            
    except Exception as e:
        logger.error(f"Error in process_create_video_task: {str(e)}", exc_info=True)
        return {'success': False, 'error': str(e)}
    finally:
        # Clean up task-specific temp files
        try:
            DeleteTempFiles(task_id)
        except Exception as e:
            logger.error(f"Error cleaning up temp files for task {task_id}: {str(e)}")

def process_upload_task(task):
    """Process upload task"""
    task_id = task['task_id']
    data = task['data']
    
    try:
        sessionid = data.get('sessionid')
        dc_id = data.get('dc_id')
        login_name = data.get('login_name')
        title = data.get('title', '')
        schedule = int(data.get('schedule', 0))
        
        if not all([sessionid, dc_id, login_name]):
            return {'success': False, 'error': 'Missing authentication parameters'}

        video_path = os.path.join(getattr(Config, 'VIDEO_DIR', VIDEO_DIR), 'video1.mp4')
        if not os.path.exists(video_path):
            return {'success': False, 'error': 'Video file not found'}

        from tiktok_uploader.cookies import save_cookies_to_file
        cookie_file = f"tiktok_session-{login_name}"
        save_cookies_to_file([
            {'name': 'sessionid', 'value': sessionid},
            {'name': 'tt-target-idc', 'value': dc_id}
        ], cookie_file)

        success = upload_video(
            session_user=login_name,
            video=video_path,
            title=title,
            schedule_time=schedule
        )

        if success:
            return {
                'success': True,
                'message': 'Video uploaded successfully'
            }
        else:
            return {
                'success': False,
                'error': 'Video upload failed'
            }
            
    except Exception as e:
        logger.error(f"Error in process_upload_task: {str(e)}", exc_info=True)
        return {'success': False, 'error': str(e)}

@app.route('/create_video', methods=['POST'])
@validate_json()
@limiter.limit(getattr(Config, 'RATE_LIMIT', "5 per minute"))
def create_video_endpoint():
    logger.info("Create video endpoint called")
    try:
        data = request.get_json()
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Create task
        task = {
            'task_id': task_id,
            'type': 'create_video',
            'data': data,
            'created_at': datetime.now().isoformat()
        }
        
        # Add task to queue
        task_queue.put(task)
        
        # Initialize task status
        with task_lock:
            task_status[task_id] = {
                'status': 'queued',
                'message': 'Task queued for processing',
                'created_at': datetime.now().isoformat()
            }
        
        logger.info(f"Task {task_id} added to queue")
        
        return jsonify({
            'task_id': task_id,
            'status': 'queued',
            'message': 'Task has been queued for processing',
            'queue_position': task_queue.qsize()
        }), 202
        
    except Exception as e:
        logger.error(f"Error in create_video_endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
@validate_json()
@limiter.limit(getattr(Config, 'RATE_LIMIT', "5 per minute"))
def upload():
    logger.info("Upload endpoint called")
    try:
        data = request.get_json() or {}
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Create task
        task = {
            'task_id': task_id,
            'type': 'upload',
            'data': data,
            'created_at': datetime.now().isoformat()
        }
        
        # Add task to queue
        task_queue.put(task)
        
        # Initialize task status
        with task_lock:
            task_status[task_id] = {
                'status': 'queued',
                'message': 'Upload task queued for processing',
                'created_at': datetime.now().isoformat()
            }
        
        logger.info(f"Upload task {task_id} added to queue")
        
        return jsonify({
            'task_id': task_id,
            'status': 'queued',
            'message': 'Upload task has been queued for processing',
            'queue_position': task_queue.qsize()
        }), 202
        
    except Exception as e:
        logger.error(f"Error in upload endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/queue/status', methods=['GET'])
def queue_status():
    """Get overall queue status"""
    with task_lock:
        queued_tasks = task_queue.qsize()
        processing_tasks = len([s for s in task_status.values() if s['status'] == 'processing'])
        completed_tasks = len([s for s in task_status.values() if s['status'] == 'completed'])
        failed_tasks = len([s for s in task_status.values() if s['status'] == 'failed'])
        total_tasks = len(task_status)
    
    return jsonify({
        'queue_size': queued_tasks,
        'processing': processing_tasks,
        'completed': completed_tasks,
        'failed': failed_tasks,
        'total_tasks': total_tasks,
        'max_workers': MAX_WORKERS,
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/tasks', methods=['GET'])
def list_tasks():
    """List recent tasks with their status"""
    with task_lock:
        # Get recent tasks (last 50)
        recent_tasks = dict(list(task_status.items())[-50:])
    
    return jsonify({
        'tasks': recent_tasks,
        'count': len(recent_tasks)
    }), 200

def graceful_shutdown(signum, frame):
    """Handle graceful shutdown"""
    global queue_worker_running
    logger.info("Received shutdown signal, shutting down gracefully...")
    
    queue_worker_running = False
    
    # Add shutdown signal to queue
    task_queue.put(None)
    
    # Wait for worker thread to finish
    if worker_thread.is_alive():
        worker_thread.join(timeout=30)
    
    # Shutdown executor
    executor.shutdown(wait=True)
    
    logger.info("Shutdown complete")
    sys.exit(0)

# Register signal handlers for graceful shutdown
signal.signal(signal.SIGINT, graceful_shutdown)
signal.signal(signal.SIGTERM, graceful_shutdown)

if __name__ == '__main__':
    # Ensure required directories exist
    video_dir = getattr(Config, 'VIDEO_DIR', VIDEO_DIR)
    cookie_dir = getattr(Config, 'COOKIE_DIR', './cookies')
    
    os.makedirs(video_dir, exist_ok=True)
    os.makedirs(cookie_dir, exist_ok=True)
    os.makedirs('./Global-Backend/assets/temp', exist_ok=True)
    
    # Get configuration from environment variables
    host = os.environ.get('HOST', getattr(Config, 'HOST', '0.0.0.0'))
    port = int(os.environ.get('PORT', getattr(Config, 'PORT', 5000)))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    # Start the server
    logger.info(f"Starting server on {host}:{port} with {MAX_WORKERS} workers")
    app.run(
        debug=debug,
        host=host,
        port=port,
        threaded=True
    )