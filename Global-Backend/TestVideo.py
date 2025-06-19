import moviepy as mpe
from moviepy.video.fx import *
import captacity
import os
import sys
import time
import yt_dlp
import numpy as np
import random
from g4f.client import Client
import assemblyai as aai
from kokoro import KPipeline
from IPython.display import display, Audio
import soundfile as sf
client = Client()
aai.settings.api_key = "588da20d4dce466fade1fbe73ab3a11c"
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
SubwayVideoURLs = ['https://youtu.be/RbVMiu4ubT0?si=HREpRiT0Bgp5MCoy','https://youtu.be/d5tRFoy2nPo','https://youtu.be/N9cyxkdtr4M','https://youtu.be/_4PARS3D6PM?si=0iEGhlTh-m9ZHBQF','https://youtu.be/GO1FzwbtSV4?si=825NUpjXeuLcmNzj','']
ProdcastsURLs =["https://youtu.be/n3Xv_g3g-mA?si=K7b1usy8-ZaolrEs",'https://youtu.be/lSQs8R4b_h0?si=CJ-DSf82-5F4z2dE','https://youtu.be/TQinQLhzhWE?si=27pFEMQiBTJihesR']
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

def transcrip(audio_path):
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio_path)
    srt_subtitles = transcript.export_subtitles_srt(chars_per_caption=60)
    f = open("./Global-Backend/assets/trnscription.srt", "w")
    f.write(srt_subtitles)
    f.close()

SubwayVideoURLs = ['https://youtu.be/RbVMiu4ubT0?si=HREpRiT0Bgp5MCoy','https://youtu.be/d5tRFoy2nPo','https://youtu.be/N9cyxkdtr4M','https://youtu.be/_4PARS3D6PM?si=0iEGhlTh-m9ZHBQF','https://youtu.be/GO1FzwbtSV4?si=825NUpjXeuLcmNzj','']
urlAudio =["https://youtu.be/n3Xv_g3g-mA?si=K7b1usy8-ZaolrEs",'https://youtu.be/lSQs8R4b_h0?si=CJ-DSf82-5F4z2dE','https://youtu.be/TQinQLhzhWE?si=27pFEMQiBTJihesR']

def create_video(bg_video, font_path, duration,Gen):
    video = None
    audio = None
    temp_dir = None
    final_video = None
    if bg_video == "Subway":
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
            'format': 'best',
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'keepvideo': True  # Keep the original file
        }
        
                
        with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo:
            info_video = ydlVideo.extract_info(videoURL, download=True)
            filename_video = ydlVideo.prepare_filename(info_video)
            print(f"Video downloaded to temporary location: {filename_video}")
            video = mpe.VideoFileClip(filename_video)
            video = video.with_effects([Resize((470, 840))])  # Resize video to 1080x1920
            video = video.subclipped(10, 10 + duration)
            if Gen == "Prodcast":
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
                    audio = audio.subclipped(100 if Gen=="Prodcast" else 0, 100 + duration if Gen=="Prodcast" else duration)
                    video = video.with_audio(audio)
                    
                print(f"Audio downloaded to temporary location: {filename_audio}")
            elif Gen == "Reddit" or Gen == "Novel":
                Generate_Speech(Gen)
                filename_audio = "./Global-Backend/assets/temp/complete_speech.mp3"
                audio = mpe.AudioFileClip(filename_audio)
                audio = audio.subclipped(0, duration)
                video = video.with_audio(audio)
            elif Gen =="Anime" or Gen == "Movie": 
                ydl_opts_video = {
                        'format': 'best/bestvideo+bestaudio',
                        'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                        'keepvideo': True  # Keep the original file
                    }
                anime_videos =Get_Content_Anime("", Gen)
                with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo:
                    info_video = ydlVideo.extract_info(anime_videos, download=True)
                    filename_video = ydlVideo.prepare_filename(info_video)
                    print(f"Video downloaded to temporary location: {filename_video}")
                    anime_video = mpe.VideoFileClip(filename_video)
                    anime_video = anime_video.subclipped(0, duration)  # Add subclip to match duration
                    
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
            
            video.write_videofile("./Global-Backend/assets/temp/video.mp4")
            if Gen != "Anime" and Gen != "Movie":
                captacity.add_captions(
                    video_file="./Global-Backend/assets/temp/video.mp4",
                    output_file="./Global-Backend/assets/temp/video_with_captions.mp4",
                    use_local_whisper=False,
                    font_size=40,
                    font=font_path,
                    font_color="white",
                    word_highlight_color="green"
                    )
            # final_video = mpe.VideoFileClip("./Global-Backend/assets/temp/video_with_captions.mp4")
            # final_video.preview(fps=30)
            return final_video
        
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


        # Force garbage collection to release file handles
        import gc
        gc.collect()

        # Add a small delay to ensure all handles are released
        time.sleep(0.5)

        # Exit the process cleanly
        sys.exit(0)

def Get_Content(model,source):
    tool_calls = [
        {
            "function": {
                "arguments": {
                    "query": "Trending Reddit Storys",
                    "max_results": 5,
                    "max_words": 5000,
                    "backend": "auto",
                    "add_text": False,
                    "timeout": 5
                },
                "name": "search_tool"
            },
            "type": "function"
        }
    ]
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": "Search Reddit for the best, most trending story. Return only the full story text — no title, no intro, no summary, no comments, no explanations. The output must be only the story, nothing else. It must be at least 1000 words long — this is absolutely required. If no story meeting this requirement is found, create an original story in authentic Reddit style that feels real and trending. Still, output only the story — no comments, disclaimers, or introductions. No exceptions. Just the story, minimum 1000 words. "}
        ],
        tool_calls=tool_calls
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content
def Get_Content_Anime(model,source):
    print("Searching for anime highlights...")
    animeName= animeList[random.randint(0, len(animeList) - 1)]
    tool_calls = [
    {
        "function": {
            "arguments": {
                "query": f"{animeName} fights 4k 60fps site:youtube.com",
                "max_results": 5,
                "max_words": 200,
                "backend": "auto",
                "add_text": True,
                "timeout": 5
            },
            "name": "search_tool"
        },
        "type": "function"
    }
]

    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": f"Go to Youtube and  Search for the best Clip (heighlight or fight from the anime  not amv or edit or some one talking) of {animeName}, and provide the link and don't forget to check if the link work , i repeate don't forget to check if the link work , the clip should be at leaste 5 min long (it's very importent for the video to be at least 5 min) and this is very important: don's add any thing else in your input just the link witout any other context like 'ok sir , here is a link for ... ' just prvide the link."}
        ],
        tool_calls=tool_calls
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content
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
try:
    final = create_video(
        bg_video="Minecraft",  # Change to "Subway", "Minecraft", or "Relaxing" as needed
        font_path="Bangers-Regular.ttf",
        duration=120,
        Gen="Anime"  # Change to "Prodcast", "Reddit", "Novel", "Anime", or "Movie" as needed
    )
    
    
finally:
    # Clean up temp files after the process ends
    # DeleteTempFiles()
    print("Process completed. Temporary files cleaned up.")