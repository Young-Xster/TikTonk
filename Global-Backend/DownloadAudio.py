import yt_dlp
import os

def download_audio(url, output_path='./Global-Backend/assets/temp'):

    
    # Configure yt-dlp options
    ydl_opts = {
        'format': 'bestaudio/best',  # Download best quality audio
        'extractaudio': True,        # Only extract audio
        'audioformat': 'mp3',        # Convert to mp3
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),  # Output template
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=True)
            return {
                'success': True,
                'title': result['title'],
                'filename': f"{result['title']}.mp3"
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Example usage
if __name__ == "__main__":
    # Replace with your YouTube URL
    video_url = "https://music.youtube.com/watch?v=KzA-Rz_gPgY&si=wh48r8C40tgMBOek"
    result = download_audio(video_url)
    
    if result['success']:
        print(f"Successfully downloaded: {result['title']}")
    else:
        print(f"Error downloading audio: {result['error']}")
