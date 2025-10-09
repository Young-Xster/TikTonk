import requests
from bs4 import BeautifulSoup
import random
import re
import os

BASE_URL = "https://hianime.to"

def get_anime_list():
    response = requests.get(f"{BASE_URL}/home")
    soup = BeautifulSoup(response.text, "html.parser")
    
    # This selector may change depending on the site structure
    anime_links = [a['href'] for a in soup.select("a.anime-card")]  
    return anime_links

def get_episodes(anime_url):
    response = requests.get(BASE_URL + anime_url)
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Selector for episodes, update if necessary
    episode_links = [a['href'] for a in soup.select("a.episode-link")]
    print(f"Found {len(episode_links)} episodes.")
    return episode_links

def download_episode(episode_url):
    response = requests.get(BASE_URL + episode_url)
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Find the video URL
    video_tag = soup.find("video")
    video_url = video_tag['src']
    
    file_name = re.sub(r'\W+', '_', episode_url.split("/")[-1]) + ".mp4"
    print(f"Downloading {file_name}...")
    
    with requests.get(video_url, stream=True) as r:
        r.raise_for_status()
        with open(file_name, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    
    print("Download completed!")

def main():
    anime_list = get_anime_list()
    random_anime = random.choice(anime_list)
    print(f"Selected anime: {random_anime}")
    
    episodes = get_episodes(random_anime)
    random_episode = random.choice(episodes)
    print(f"Selected episode: {random_episode}")
    
    download_episode(random_episode)

if __name__ == "__main__":
    main()
