MyTube — React Web + React Native (Expo) + Server

Tiny video player app — lists YouTube video IDs stored in MongoDB, server enriches metadata via YouTube Data API, plays videos inside apps (Web / iOS / Android).
Live demo: https://mytube-green-eta.vercel.app/

✨ Project Overview

MyTube is a small full-stack project built to satisfy the LearnOverse internship assignment:

MongoDB stores only videoId values (10 items recommended).

Server fetches those IDs, calls the YouTube Data API to enrich metadata (title, thumbnails, channel, duration) and returns JSON.

Clients (Web + React Native) show a scrollable list of videos; tapping opens a player screen that plays inside the app (not deep-linking to YouTube).

Deliverables: client/ (React web or React Native web), mobile/ (Expo React Native app) and server/ (Node.js or Python). This repo follows that pattern: top-level client/ and server/.

📁 Repo Structure (recommended)
/
├─ client/          # React web (or React + Vite front-end)
├─ mobile/          # React Native (Expo) app for iOS/Android
├─ server/          # Node.js (Express) server that returns enriched video list
├─ README.md
└─ .env.example


If your actual code is split into separate GitHub repos, put matching READMEs in each repo (client and server). This README assumes a monorepo but is easily split.

🧰 Tech stack

Client (Web): React (Vite/CRA), Tailwind CSS (for styling), React Router (optional)

Mobile: React Native with Expo (managed workflow) — works on iOS & Android

Server: Node.js + Express (or Python/Flask) — returns enriched video metadata

Database: MongoDB (Compass for seeding). The DB stores only videoIds.

YouTube Data API v3: fetches metadata (API key required)

Optional: react-player / WebView / react-native-youtube-iframe for in-app playback

⚙️ Required keys / variables

Create a .env in the project root (or in server/) — never commit secrets.

.env.example

# Server
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mytube?retryWrites=true&w=majority

# YouTube API
YOUTUBE_API_KEY=AIza...your_key_here

# Optional
NODE_ENV=development


Important: The reviewers request that you include the MongoDB connection URL in code / in repo so they can access it — if you choose to share a read-only connection string, put it in the repo server/.env or in the README explicitly (only do this if you're comfortable with access). Otherwise, provide clear instruction for how reviewers should run locally and seed MongoDB.

🔌 Server — API contract (example)

GET /api/videos
Returns an array of enriched video objects:

[
  {
    "videoId": "dQw4w9WgXcQ",
    "title": "Artist - Song",
    "channelTitle": "Channel Name",
    "duration": "PT3M33S",
    "thumbnails": {
      "default": {...}, "medium": {...}, "high": {...}
    }
  },
  ...
]


Server behavior:

Read videoIds from MongoDB collection (documents with { videoId: "..." }).

Call YouTube Data API videos?part=snippet,contentDetails&id=...&key=YOUTUBE_API_KEY.

Merge/return the enriched objects to client.

🚀 Local setup — Server

(Assumes Node.js + Express)

cd server
cp .env.example .env
# edit .env to add your actual MONGODB_URI and YOUTUBE_API_KEY
npm install
npm run dev        # or: node index.js
# server runs on http://localhost:4000 by default


If you need a quick seed script (example using mongo or Node):

// server/seed.js (example)
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const videoIds = [
  "dQw4w9WgXcQ","3JZ_D3ELwOQ","...","(10 ids total)"
];

async function seed() {
  await client.connect();
  const db = client.db('mytube-db');
  const col = db.collection('videoIds');
  await col.deleteMany({});
  await col.insertMany(videoIds.map(id => ({ videoId: id })));
  console.log('Seeded videoIds');
  await client.close();
}
seed();


Run with node seed.js (after installing mongodb and setting .env).

▶️ Local setup — Web client (React)
cd client
cp .env.example .env       # if client needs API_BASE or similar
npm install
npm run dev                # Vite: `npm run dev`; CRA: `npm start`
# open http://localhost:3000 (or port shown)


Client should call SERVER_API_URL (or http://localhost:4000/api/videos) to fetch enriched video list.

📱 Local setup — Mobile (Expo)
cd mobile
cp app.json.example app.json   # if you want to set icon/splash
# OR update app.json/app.config.js icon path to ./assets/icon.png
npm install
expo start
# scan QR to open on device or run emulator:
# expo run:android  OR  expo run:ios  (if configured)

Changing the app icon

Open app.json and set:

{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash-icon.png" },
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}


Recommended icon size: 1024×1024 PNG. For adaptive Android icon, add foregroundImage and a background color or image.

🎬 Playback implementation notes

Web: use react-player or <iframe> embed inside an in-app modal. react-player gives more control.

React Native: recommended options:

react-native-youtube-iframe — lightweight, works inside RN WebView under the hood.

react-native-webview with the YouTube embed URL (ensure in-app playback).

Ensure you request/handle YouTube embed playback policies if needed.

✅ Minimal acceptance checklist

 MongoDB stores only videoIds (not full metadata).

 Server endpoint fetches video IDs from MongoDB and enriches via YouTube Data API before returning JSON.

 Client lists 10 videos in a scrollable list (thumbnail, title, channel).

 Tapping a video opens an in-app player screen and plays the video.

 Screens recording (≤ 2 min) demonstrates app flow: launch → list → play video → back → play another.

 MongoDB connection URL provided (if you agreed to share).

📸 Screenshots / Demo

Add screenshots of:

Home list with thumbnails

Video player screen (playing)

Mobile & Web screenshots

(Place images in client/public/screenshots/ and reference them in README with ![alt](path))

🛠️ Deployment

Web: Build and deploy to Vercel/Netlify:

cd client
npm run build
# push to Vercel or Netlify


Server: Deploy to Heroku / Railway / Fly / Vercel Serverless functions (ensure environment variables are set).

Mobile: Build native binaries with Expo:

expo build:android
expo build:ios
# or use EAS Build if configured

🧾 Screen recording requirement

Create a short screen recording (≤ 2 minutes) that shows:

App launch (web or mobile)

List of 10 videos

Tap → Video plays inside the app

Back → Tap another → plays
Include this recording in the submission (link or file).

🧩 Troubleshooting tips

If thumbnails or videos won’t load, confirm YOUTUBE_API_KEY is valid and requests are not rate-limited.

If app shows old assets (icon/splash), clear caches: expo start -c or browser cache.

For iOS playback quirks, prefer the official react-native-youtube-iframe or WebView with proper allowsInlineMediaPlayback settings.

🙏 Credits & License

Built for LearnOverse internship assignment.
License: MIT — see LICENSE for details.

📎 Quick links / checklist for reviewers

Demo: https://mytube-green-eta.vercel.app/

client/ — React (web)

mobile/ — Expo React Native (iOS + Android)

server/ — Node/Express API: GET /api/videos

MongoDB connection: [include connection string or instructions here]

YouTube API key: set in server/.env as YOUTUBE_API_KEY
