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
from config import Config
from logger import logger

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

# Error handler for rate limiting
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded", "message": str(e.description)}), 429

# Error handler for all other exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
    return jsonify({"error": "Internal server error", "message": str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

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
  "Attack on Titan",
  "Naruto",
  "Naruto Shippuden",
  "One Piece",
  "Dragon Ball Z",
  "Dragon Ball Super",
  "Bleach",
  "Fullmetal Alchemist: Brotherhood",
  "Fullmetal Alchemist",
  "Death Note",
  "My Hero Academia",
  "Hunter x Hunter",
  "Demon Slayer: Kimetsu no Yaiba",
  "Jujutsu Kaisen",
  "Sword Art Online",
  "Tokyo Ghoul",
  "One Punch Man",
  "Code Geass: Lelouch of the Rebellion",
  "Steins;Gate",
  "Cowboy Bebop",
  "Neon Genesis Evangelion",
  "Mob Psycho 100",
  "Fairy Tail",
  "Black Clover",
  "Re:Zero − Starting Life in Another World",
];
SubwayVideoURLs = ['https://youtu.be/N9cyxkdtr4M','https://youtu.be/_4PARS3D6PM?si=0iEGhlTh-m9ZHBQF','https://youtu.be/GO1FzwbtSV4?si=825NUpjXeuLcmNzj']
ProdcastsURLs =["https://youtu.be/3YmxmCg2Xik?si=05mKDwOFr8kQoHIf",'https://youtu.be/F5sD97lw0Dg?si=J6GvM9YtSQiho5TP','https://youtu.be/TQinQLhzhWE?si=27pFEMQiBTJihesR']
MinecraftVideoURLs = ['https://youtu.be/XBIaqOm0RKQ?si=aMZGBYVNZsSbJARx','https://youtu.be/s600FYgI5-s?si=NRitVh7ELOBbFI3w','https://youtu.be/aF828t3G5Gc?si=W0VAELqaHnPPV3Yu','https://youtu.be/R4-d2XBwpaQ?si=cEROKrjmJ6ARzEQD']
RelaxingVideoURLs = ['https://youtu.be/wr868MUcTag?si=QI2ITFT0A8aKkI6O','https://youtu.be/X_ZrBEekL-k?si=a3meDJFxj45C84Zw','https://youtu.be/8Ckne4QCVyo?si=7Bryaw-m3YLS3rDg']

def DeleteTempFiles():
    temp_dir = "./Global-Backend/assets/temp"
    for item in os.listdir(temp_dir):
        item_path = os.path.join(temp_dir, item)
        if os.path.isdir(item_path):
            try:
                import shutil
                shutil.rmtree(item_path)
            except Exception as e:
                print(f"Error deleting directory {item_path}: {e}")
        elif os.path.isfile(item_path):
            try:
                os.remove(item_path)
            except Exception as e:
                print(f"Error deleting file {item_path}: {e}")


urlAudio =["https://youtu.be/3YmxmCg2Xik?si=05mKDwOFr8kQoHIf",'https://youtu.be/F5sD97lw0Dg?si=J6GvM9YtSQiho5TP','https://youtu.be/TQinQLhzhWE?si=27pFEMQiBTJihesR']


def create_video(bg_video, font_path, duration, Gen, quality):
    video = None
    audio = None
    temp_dir = None
    final_video = None
    if bg_video == "SS":
        videoURL = SubwayVideoURLs[random.randint(0, len(SubwayVideoURLs) - 1)]
    elif bg_video == "Minecraft":
        videoURL = MinecraftVideoURLs[random.randint(0, len(MinecraftVideoURLs) - 1)]
    elif bg_video == "Relaxing":
        videoURL = RelaxingVideoURLs[random.randint(0, len(RelaxingVideoURLs) - 1)]

    try:
        # Create a temporary directory in assets folder
        temp_dir = "./Global-Backend/assets/temp"
        # Configure yt-dlp options
        ydl_opts_video = {
            'format': f'bestvideo[height<={quality}]', # No audio, just video
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'keepvideo': True  # Keep the original file
        }

        with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo:
            info_video = ydlVideo.extract_info(videoURL, download=True)
            filename_video = ydlVideo.prepare_filename(info_video)
            # print(f"Video downloaded to temporary location: {filename_video}")
            video = mpe.VideoFileClip(filename_video)
            video = video.with_effects([Resize((470, 840))])  # Resize video to 1080x1920
            video = video.subclipped(10, 10 + duration)
            # print(Gen)
            if Gen == "Podcast":
                # print("Downloading audio for Prodcast...")
                ydl_opts_audio = {
                    'format': 'bestaudio/best',  # Download best quality audio
                    'extractaudio': True,        # Only extract audio
                    'audioformat': 'mp3',        # Convert to mp3
                    'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),  # Output template
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                    'keepvideo': True,  # Keep the original file
                }
                with yt_dlp.YoutubeDL(ydl_opts_audio) as ydlAudio: 
                    info_audio = ydlAudio.extract_info(ProdcastsURLs[random.randint(0, len(ProdcastsURLs) - 1)], download=True)
                    filename_audio = ydlAudio.prepare_filename(info_audio)
                    audio = mpe.AudioFileClip(filename_audio)
                    start= random.randint(0, audio.duration - 300)
                    audio = audio.subclipped(start if Gen=="Prodcast" else 0, start + duration if Gen=="Prodcast" else duration)
                    video = video.with_audio(audio)

                # print(f"Audio downloaded to temporary location: {filename_audio}")
            elif Gen == "Reddit" or Gen == "Novel":
                Generate_Speech(Gen)
                filename_audio = "./Global-Backend/assets/temp/complete_speech.mp3"
                audio = mpe.AudioFileClip(filename_audio)
                audio = audio.subclipped(0, duration)
                video = video.with_audio(audio)
            elif Gen =="Anime" or Gen == "Movie": 
                ydl_opts_video = {
                        'format': f'bestvideo[height<={quality}]+bestaudio/best',
                        'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                        'keepvideo': True  # Keep the original file
                    }
                anime_videos =Get_Content_Anime("", Gen)
                with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo:
                    info_video = ydlVideo.extract_info(anime_videos, download=True)
                    filename_video = ydlVideo.prepare_filename(info_video)
                    # print(f"Video downloaded to temporary location: {filename_video}")
                    anime_video = mpe.VideoFileClip(filename_video)
                    start = random.randint(0, int(anime_video.duration - duration))  # Random start point
                    anime_video = anime_video.subclipped(start, start + duration)  # Add subclip to match duration
                    # Resize and position videos for split screen
                    anime_video = anime_video.with_effects([Resize((470,300))])  # Match width of main video
                    video = video.with_effects([Resize((470, 840 - anime_video.h))])  # Adjust height to fit below anime video
                    anime_video = anime_video.with_position(('center', 0))  # Position at top
                    video = video.with_position(('center', anime_video.h))  # Position below anime

                    # Create a blank background of proper size
                    final_clip = mpe.ColorClip(size=(470, 840), color=(0,0,0), duration=duration)

                    # Composite the videos
                    final_clip = mpe.CompositeVideoClip([
                        final_clip,
                        anime_video,
                        video
                    ])
                    video = final_clip  # Replace video with the composite clip
            video.write_videofile("./Global-Backend/assets/temp/video.mp4"if Gen != "Anime" and Gen != "Movie" else "./Global-Backend/assets/temp/video1.mp4",)
            if Gen != "Anime" and Gen != "Movie":
                print("Adding captions to the video...")
                captacity.add_captions(
                    video_file="./Global-Backend/assets/temp/video.mp4",
                    output_file="./Global-Backend/assets/temp/video1.mp4",
                    use_local_whisper=False,
                    font_size=40,
                    font=font_path,
                    font_color="white",
                    word_highlight_color="green"
                    )
            # final_video = mpe.VideoFileClip("./Global-Backend/assets/temp/video_with_captions.mp4")
            # final_video.preview(fps=30)
            print("Video created successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        raise ValueError("Video could not be downloaded.")

    finally:
        # Close all clips first
        if video is not None:
            video.close()
        if audio is not None:
            audio.close()
        if final_video is not None:
            final_video.close()



def Get_Content(model, source):
    print(f"Getting {source} content...")
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
                { "role": "system",
  "content": "You are an AI that, when the user says the single word 'go', will do the following:\n\n- \n- Search for the best, most trending story {source}.\n- Return **only** the full story text — **no title, no intro, no summary, no comments, no explanations.**\n- The story must be **at least 1000 words long. This is absolutely required.**\n- If no story meeting this requirement is found, then you must **create an original story** in authentic {source} style that feels real and trending.\n  - If  'Reddit', it should resemble posts like: *'Am I the asshole for leaving my kids out my inheritance…'*, *'I was in love with my boyfriend 24M, me 22F…'*.\n  - Otherwise, it should resemble posts like: *'The human race is one of the strongest warriors in history…' or somthing like that, somthing populer*.\n\n**Very Important Rules:**\n- Output **only** the story — no comments, no disclaimers, no introductions, no formatting, no titles. \n- The output must be **plain story text of at least 1000 words.**\n- Do not do anything until the user says exactly: **go**."
},{ "role": "user", "content": "go"}
            ],
            tool_calls=tool_calls
        )
        if response and response.choices and response.choices[0].message.content:
            return response.choices[0].message.content
        raise Exception("No valid response from GPT")
    except Exception as e:
        print(f"Error in Get_Content: {str(e)}")
        # Fallback story for when search/API fails
        fallback_story = """AITA for refusing to let my sister use my wedding venue after she tried to take it from me? I (28F) am getting married next month to my fiancé James (30M). We found this beautiful historic mansion that was perfect for our wedding and booked it immediately. My sister Amy (32F) got engaged two months after us but wanted to get married before us. When she found out about our venue, she tried to convince the owners to let her use it on our date, claiming we had canceled. Fortunately, they contacted us to confirm, and we cleared up the confusion. Now Amy is crying to our family, saying I'm being selfish and should let her have the venue since she's the older sister. Our parents are split - dad supports me, but mom thinks I should "be the bigger person." I refused to budge. AITA?"""
        if len(fallback_story) < 1000:
            # Extend the story to meet minimum length
            fallback_story += """ The situation has gotten even more complicated since then. Amy has been posting on social media about how I'm "ruining her dream wedding" and has gotten some of our extended family involved. Some cousins are now refusing to come to my wedding, saying I'm being unfair to Amy. But what really pushed me over the edge was discovering that Amy had actually gone behind my back and tried to contact our vendors, pretending to be me to change the wedding date. I only found out because our photographer called to confirm a date change request. I'm furious and hurt that she would go to such lengths. James is suggesting we hire security for the wedding day, worried that Amy might try to cause a scene. Our mom is still insisting that I should give in to keep the peace, saying "You can find another venue, but you can't find another sister." But I feel like giving in would just enable her manipulative behavior. The whole situation is causing so much stress that it's overshadowing what should be a happy time in our lives. Some of our friends think we should just elope and avoid the drama altogether, but why should we have to compromise our dream wedding because of my sister's unreasonable behavior? AITA for standing my ground?"""
        return fallback_story

def Get_Content_Anime(model,source):
    lislt = [
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
    # Get random series and episode
    random_series = random.choice(lislt)
    random_episode = random.choice(random_series['episodes'])
    print("Url Selected", random_episode['url'])
    return random_episode['url']
#     print("Searching for anime/movies highlights...")
#     animeName= animeList[random.randint(0, len(animeList) - 1)]
#     movieName= movieList[random.randint(0, len(movieList) - 1)]
    
#     tool_calls = [
#             {
#                 "function": {
#                     "arguments": {
#                         "query": f"{animeName if source == 'Anime' else movieName} youtube",
#                         "max_results": 5,
#                         "max_words": 5000,
#                         "backend": "auto",
#                         "add_text": False,
#                         "timeout": 5
#                     },
#                     "name": "search_tool"
#                 }
#             }
#         ]
#     response = client.chat.completions.create(
#         model="sonar-pro",
#         provider='PerplexityLabs',
#         messages=[
#             {"role": "system",
#   "content": f"You are an AI that, when the user says the single word 'go', will do the following:\n\n-- Go to YouTube and search for the **best clip (highlight or fight scene)** from {animeName if source == "Anime" else movieName}.\n- The clip **must not** be an AMV, an edit, or someone talking about the content — it must be an actual scene.\n- The clip **must be at least 5 minutes long.**\n- If the found clip is not at least 5 minutes long, search again or find a similar one that is.\n- **Verify that the link works** before returning it, i repete only provide REAL links THAT WORKS make sure it work test it or do what every you want but when the user click on the link it should work .\n\n**Very Important Rules:**\n- Output **only** the working link (URL) — nothing else.\n- Do **not** include any context, comments, text, or explanations.\n- Wait and do nothing until the user says exactly: go."},{ "role": "user", "content": "go"}
#         ]
#     )
#     print(response.choices[0].message.content)
#     return response.choices[0].message.content

def Generate_Speech(Gen):
    pipeline = KPipeline(lang_code='a')
    text = Get_Content("","")
    generator = pipeline(text, voice='am_adam')
    # Create a list to store all audio chunks
    all_audio = []
    # Collect all audio chunks
    for i, (gs, ps, audio) in enumerate(generator):
        print(i, gs, ps)
        if i == 0:
            display(Audio(data=audio, rate=24000, autoplay=True))
        all_audio.append(audio)
    # Concatenate all audio chunks into a single array
    final_audio = np.concatenate(all_audio)
    
    # Save the complete audio as a single file
    sf.write('./Global-Backend/assets/temp/complete_speech.mp3', final_audio, 24000)
    return 'complete_speech.mp3'

# Usage
# try:
#     final = create_video(
#         bg_video="Minecraft",  # Change to "Subway", "Minecraft", or "Relaxing" as needed
#         font_path="Bangers-Regular.ttf",
#         duration=120,
#         Gen="Reddit"  # Change to "Prodcast", "Reddit", "Novel", "Anime", or "Movie" as needed
#     )
    
    
# finally:
#     # Clean up temp files after the process ends
#     # DeleteTempFiles()
#     print("Process completed. Temporary files cleaned up.")

@app.route('/create_video', methods=['POST'])
@validate_json()
@limiter.limit(Config.RATE_LIMIT)
def create_video_endpoint():
    logger.info("Create video endpoint called")
    try:
        data = request.get_json()
        bg_video = data.get('bg_video')
        font_path = data.get('font_path', Config.FONT_PATH)
        duration = data.get('duration')
        gen = data.get('gen')
        quality = data.get('quality', Config.DEFAULT_VIDEO_QUALITY)
        sessionid = data.get('sessionid')
        dc_id = data.get('dc_id')
        login_name = data.get('login_name')
        title = data.get('title')
        schedule = data.get('schedule')
        if not all([bg_video, duration, gen]):
            return jsonify({'error': 'Missing required parameters'}), 400

        for i in range(5):
            try:
                create_video(bg_video, font_path, duration, gen, quality)
                filename = "video1.mp4"
                file_path = os.path.join(VIDEO_DIR, filename)
                print("Upload endpoint called")
                VIDEO_PATH = os.path.join(VIDEO_DIR, 'video1.mp4')  # Ensure the path is correct
                if not all([sessionid, dc_id, login_name]):
                    return jsonify({'error': 'Missing authentication parameters'}), 400

                VIDEO_PATH = os.path.join(Config.VIDEO_DIR, 'video1.mp4')
                if not os.path.exists(VIDEO_PATH):
                    return jsonify({'error': 'Video file not found'}), 404

                # Save cookies into a file for reuse
                from tiktok_uploader.cookies import save_cookies_to_file
                # Save cookies into a file for reuse (cookies list first, filename second)
                save_cookies_to_file([
                    {'name': 'sessionid', 'value': sessionid},
                    {'name': 'tt-target-idc', 'value': dc_id}
                ], f"tiktok_session-{login_name}")

                success = upload_video(
                    session_user=login_name,
                    video=VIDEO_PATH,
                    title=title,
                    schedule_time=0
                )

                if success:
                    logger.info(f"Video uploaded successfully for user {login_name}")
                    return jsonify({
                        'success': True,
                        'message': 'Video created and uploaded successfully'
                    }), 200
                else:
                    logger.error(f"Video upload failed for user {login_name}")
                    return jsonify({
                        'success': False,
                        'message': 'Video upload failed'
                    }), 500

            except Exception as e:
                logger.error(f"Attempt {i+1} failed: {str(e)}", exc_info=True)
                if i == 4:  # Last attempt
                    return jsonify({
                        'error': 'Video creation failed after multiple attempts',
                        'message': str(e)
                    }), 500

    except Exception as e:
        logger.error(f"Unexpected error in create_video_endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            DeleteTempFiles()
        except Exception as e:
            logger.error(f"Error cleaning up temporary files: {str(e)}", exc_info=True)

@app.route('/upload', methods=['POST'])
@validate_json()
@limiter.limit(Config.RATE_LIMIT)
def upload():
    logger.info("Upload endpoint called")
    try:
        data = request.get_json() or {}
        sessionid = data.get('sessionid')
        dc_id = data.get('dc_id')
        login_name = data.get('login_name')
        title = data.get('title', '')
        schedule = int(data.get('schedule', 0))
        
        if not all([sessionid, dc_id, login_name]):
            return jsonify({'error': 'Missing authentication parameters'}), 400

        VIDEO_PATH = os.path.join(Config.VIDEO_DIR, 'video1.mp4')
        if not os.path.exists(VIDEO_PATH):
            return jsonify({'error': 'Video file not found'}), 404

        from tiktok_uploader.cookies import save_cookies_to_file
        cookie_file = os.path.join(Config.COOKIE_DIR, f"tiktok_session-{login_name}")
        save_cookies_to_file([
            {'name': 'sessionid', 'value': sessionid},
            {'name': 'tt-target-idc', 'value': dc_id}
        ], cookie_file)

        success = upload_video(
            session_user=login_name,
            video=VIDEO_PATH,
            title=title,
            schedule_time=schedule
        )

        if success:
            logger.info(f"Video uploaded successfully for user {login_name}")
            return jsonify({
                'success': True,
                'message': 'Video uploaded successfully'
            }), 200
        else:
            logger.error(f"Video upload failed for user {login_name}")
            return jsonify({
                'success': False,
                'message': 'Video upload failed'
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error in upload endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            DeleteTempFiles()
        except Exception as e:
            logger.error(f"Error cleaning up temporary files: {str(e)}", exc_info=True)

if __name__ == '__main__':
    # Ensure required directories exist
    os.makedirs(Config.VIDEO_DIR, exist_ok=True)
    os.makedirs(Config.COOKIE_DIR, exist_ok=True)
    
    # Start the server
    logger.info(f"Starting server on {Config.HOST}:{Config.PORT}")
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
    
















