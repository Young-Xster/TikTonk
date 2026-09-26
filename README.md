# TikTonk

TikTonk is an end-to-end short-form content automation platform that generates videos with AI, schedules posts, and publishes to social media from a single workflow.

## What TikTonk Does

- Generates short videos automatically from trend-driven content pipelines
- Creates voiceovers for story-based formats (Reddit-style, novel-style, podcast clips, anime/movie cuts)
- Adds stylized captions and exports vertical video output ready for reels/shorts
- Lets users manage connected social accounts from web and mobile apps
- Queues and processes video generation + upload jobs asynchronously
- Publishes videos programmatically with scheduling support

## Product Architecture

This repository includes three major parts:

- **`Global-Backend/`** — Flask API for video generation, task queueing, status tracking, and upload orchestration
- **`frontend-web/`** — React + Vite web app for onboarding, dashboard, creation flow, scheduler, and platform connections
- **`FrontendMobile/TikTonk/`** — Expo React Native mobile app for account management and mobile creation workflows

## Core Backend API

Base URL (local): `http://localhost:5000`

- `POST /create_video` — queue a create (and optional upload) task
- `POST /upload` — queue an upload-only task
- `GET /task/<task_id>` — get status/result for a specific task
- `GET /tasks` — list recent tasks
- `GET /queue/status` — queue health + counters
- `GET /health` — service health check

## Tech Stack

- **Backend:** Flask, MoviePy, yt-dlp, Kokoro TTS, AssemblyAI integration, task workers
- **Web:** React 19, Vite, Tailwind, Appwrite integration
- **Mobile:** Expo / React Native, Expo Router, Appwrite integration

## Local Setup

### 1) Clone and install dependencies

```bash
git clone https://github.com/Young-Xster/TikTonk.git
cd TikTonk
```

### 2) Backend setup

```bash
cd Global-Backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python Main.py
```

Backend runs on port `5000` by default.

### 3) Web app setup

```bash
cd frontend-web
npm install
npm run dev
```

### 4) Mobile app setup

```bash
cd FrontendMobile/TikTonk
npm install
npx expo start
```

## Configuration

Backend uses environment variables (from `Global-Backend/config.py`). Common options:

- `HOST` (default `0.0.0.0`)
- `PORT` (default `5000`)
- `DEBUG` (default `False`)
- `ALLOWED_ORIGINS`
- `RATE_LIMIT`
- `MAX_WORKERS`
- `VIDEO_DIR`
- `COOKIE_DIR`
- `FONT_PATH`

## Typical Flow

1. User creates content from web or mobile client
2. Client sends payload to `/create_video`
3. Backend queues the task and returns a task ID immediately
4. Worker generates video, captions, and audio
5. Worker optionally uploads/schedules to connected account
6. Client polls `/task/<task_id>` for completion and result

## Repository Structure

```text
TikTonk/
├── Global-Backend/
├── frontend-web/
├── FrontendMobile/
├── LibTikTonkV2.0/
├── assets/
└── README.md
```

## Security Notes

- Never commit real account cookies, tokens, or secrets
- Use environment variables for all sensitive values
- Keep cookie/session artifacts out of version control

## License

No license file is currently defined in this repository.
