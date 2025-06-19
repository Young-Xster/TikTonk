from moviepy import *
from moviepy.video.fx import *
import tempfile
import requests
import os
import sys
import time
import yt_dlp
import numpy as np
import assemblyai as aai 
aai.settings.api_key = "588da20d4dce466fade1fbe73ab3a11c"
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

urlVideo = 'https://youtu.be/4TksxjQjvkQ?si=VAbdR1ORZKLrAPLv'
urlAudio ="https://youtu.be/h6fcK_fRYaI?si=ojZesrTQrXqZ_f43"

def create_video(videoURL, audioURL, font_path, duration):
    video = None
    audio = None
    temp_dir = None
    f = None
    final_video = None
    subtitle_clips = []
    
    try:
        # Create a temporary directory in assets folder
        temp_dir = "./Global-Backend/assets/temp"
        # Configure yt-dlp options
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
        ydl_opts_video = {
            'format': 'best',
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'keepvideo': True  # Keep the original file
        }
        
        with yt_dlp.YoutubeDL(ydl_opts_video) as ydlVideo , yt_dlp.YoutubeDL(ydl_opts_audio) as ydlAudio:
            info_video = ydlVideo.extract_info(videoURL, download=True)
            filename_video = ydlVideo.prepare_filename(info_video)
            print(f"Video downloaded to temporary location: {filename_video}")
            info_video = ydlAudio.extract_info(audioURL, download=True)
            filename_audio = ydlAudio.prepare_filename(info_video)
            print(f"Audio downloaded to temporary location: {filename_audio}")
            
            video = VideoFileClip(filename_video)
            video = video.with_effects([vfx.Resize((470, 840))])  # Resize video to 1080x1920
            video = video.subclipped(10, 10 + duration)  # Subclip the video to the specified duration
            video = video
            audio = AudioFileClip(filename_audio)
            audio = audio.subclipped(100, 100 + duration)  # Subclip the audio to the specified duration
            audio.write_audiofile("./Global-Backend/assets/temp/audio.mp3")
            audio = AudioFileClip("./Global-Backend/assets/temp/audio.mp3")
            # transcrip("./Global-Backend/assets/temp/audio.mp3")
            video = video.with_audio(audio)
            
            # Read subtitles
            f = open("./Global-Backend/assets/trnscription.srt", "r")
            subtitles = f.read().split("\n\n")
            f.close()  # <— close immediately after reading
            
            subtitle_clips = []
            for subtitle in subtitles:
                lines = subtitle.split("\n")
                if len(lines) >= 3:
                    txt_clip = TextClip(
                        text=lines[2],
                        font_size=20,
                        color='white',
                        font=font_path,
                        stroke_color='black',
                        stroke_width=2,
                        method='caption',
                        size=(int(video.w * 0.85), None)
                    )
                    start, end = lines[1].split(" --> ")
                    txt_clip = txt_clip.with_position(('center', 'center')) \
                                       .with_start(start.replace(",", ".")) \
                                       .with_end(end.replace(",", "."))
                    subtitle_clips.append(txt_clip)
            
            # Combine video with subtitles
            final_video = CompositeVideoClip([video] + subtitle_clips)
            final_video.preview(fps=30)
            
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
        for clip in subtitle_clips:
            if clip is not None:
                clip.close()
        
        # Force garbage collection to release file handles
        import gc
        gc.collect()
        
        # Add a small delay to ensure all handles are released
        time.sleep(0.5)
        
        # Exit the process cleanly
        sys.exit(0)

# Usage
try:
    final = create_video(
        urlVideo,
        urlAudio,
        "C:/Users/Lenovo/Desktop/The Big League/TikTonk/Global-Backend/assets/font1.otf",
        120
    )
finally:
    # Clean up temp files after the process ends
    # DeleteTempFiles()
    print("Process completed. Temporary files cleaned up.")
