import assemblyai as aai
import time
import os

# Set your AssemblyAI API key
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

def transcribe_with_api(
    audio_file: str,
    prompt: str | None = None
):
    """
    Transcribe an audio file using the AssemblyAI API
    """
    transcriber = aai.Transcriber()
    
    # Start transcription
    config = {}
    if prompt:
        # If there's a prompt, use it as a context hint
        config['prompt'] = prompt
    
    transcript = transcriber.transcribe(
        audio_file,
        **config
    )
    print(transcript)

    # Format the response to match the expected structure
    words = []
    segments = []
    
    # Process words and segments
    for word in transcript.words:
        words.append({
            "word": " " + word.text,  # Add space to match previous format
            "start": word.start / 1000.0,  # Convert ms to seconds
            "end": word.end / 1000.0
        })
    
    if words:
        # Create a single segment containing all words
        segments = [{
            "start": words[0]["start"],
            "end": words[-1]["end"],
            "words": words
        }]

    return segments

def transcribe_locally(
    audio_file: str,
    prompt: str | None = None
):
    """
    Transcribe using AssemblyAI (local transcription not supported)
    """
    # Fall back to API version since local transcription is not supported
    return transcribe_with_api(audio_file, prompt)
