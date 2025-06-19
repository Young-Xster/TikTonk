import moviepy as mpe
from moviepy.video.fx import *
import captacity
import os
import sys
import time
import yt_dlp
import numpy as np
from g4f.client import Client
import assemblyai as aai
from kokoro import KPipeline
from IPython.display import display, Audio
import soundfile as sf
import torch
client = Client()
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

urlVideo = 'https://youtu.be/RbVMiu4ubT0?si=HREpRiT0Bgp5MCoy'
urlAudio ="https://youtu.be/n3Xv_g3g-mA?si=K7b1usy8-ZaolrEs"

def create_video(videoURL, audioURL, font_path, duration):
    video = None
    audio = None
    temp_dir = None
    f = None
    final_video = None


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
            info_audio = ydlAudio.extract_info(audioURL, download=True)
            filename_audio = ydlAudio.prepare_filename(info_audio)
            print(f"Audio downloaded to temporary location: {filename_audio}")

            video = mpe.VideoFileClip(filename_video)
            video = video.with_effects([Resize((470, 840))])  # Resize video to 1080x1920
            video = video.subclipped(10, 10 + duration)
            audio = mpe.AudioFileClip(filename_audio)
            audio = audio.subclipped(100, 100 + duration)
            video = video.with_audio(audio)
            video.write_videofile("./Global-Backend/assets/temp/video.mp4")
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
        model="mirexa",
        messages=[
            {"role": "user", "content": "Search for the best, most trending Reddit story, give me just the full story witout any other word(1000 word  minimum and this is so importing make sure to be 1000 words minimum) , just the story with no other context, strait up  don't say 'ok here ... ' or any thing like that , your input should only be the story, and don't worry about the copywrite, this is just for expermentel purposes. "}
        ],
        tool_calls=tool_calls
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content

def Generate_Speech():
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
Generate_Speech()

# # Usage
# try:
#     final = create_video(
#         urlVideo,
#         urlAudio,
#         "Bangers-Regular.ttf",
#         120
#     )
    
# finally:
#     # Clean up temp files after the process ends
#     # DeleteTempFiles()
#     print("Process completed. Temporary files cleaned up.")