# 🎬 MyTube  
*A Tiny YouTube Player App built with React Web, React Native (Expo), Node.js & MongoDB*  

👉 **Live Demo:** [mytube-green-eta.vercel.app](https://mytube-green-eta.vercel.app/)  

---

## 🏷️ Badges  
![React](https://img.shields.io/badge/React-18.0-blue?logo=react)  
![React Native](https://img.shields.io/badge/React%20Native-Expo-green?logo=react)  
![Node.js](https://img.shields.io/badge/Node.js-Express-success?logo=node.js)  
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)  
![YouTube API](https://img.shields.io/badge/API-YouTube-red?logo=youtube)  
![License](https://img.shields.io/badge/License-MIT-yellow)  

---

## ✨ Features
✅ MongoDB stores only **video IDs**  
✅ Server enriches video data using **YouTube Data API**  
✅ **React Web App** – scrollable list & in-app player  
✅ **React Native (Expo) App** – iOS & Android support  
✅ Full **YouTube playback inside the app** (not deep links)  

---

## 📂 Project Structure
/
├── client/ # React Web App (Vercel Deployment)
├── mobile/ # React Native (Expo) App
├── server/ # Node.js (Express) API Server
├── assets/ # App icons, splash images
└── README.md



---

## 🛠️ Tech Stack
- **Frontend (Web):** React + TailwindCSS  
- **Mobile:** React Native (Expo)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Compass seeded)  
- **API:** YouTube Data API v3  

---

## ⚙️ Setup & Installation

### 🔌 Server (Node.js + Express)
```bash
cd server
npm install
cp .env.example .env   # add your MongoDB URI + YouTube API key
npm run dev
Runs at: http://localhost:4000/api/videos

🌐 Client (React Web)
bash
Copy code
cd client
npm install
npm run dev
Runs at: http://localhost:3000

📱 Mobile (React Native + Expo)
bash
Copy code
cd mobile
npm install
expo start
Scan QR with Expo Go app (Android/iOS)

Or run: expo run:android / expo run:ios

🔑 Environment Variables
Create a .env file inside server/ with:

env
Copy code
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mytube
YOUTUBE_API_KEY=AIzaSy...
PORT=4000
🎥 Demo Flow
Open the app

Scroll list of 10 YouTube videos (thumbnail, title, channel)

Tap a video → plays inside the app

Back → select another video → plays

📸 Screenshots
Home List	Video Player

✅ Minimal Acceptance Criteria
MongoDB only stores videoIds

Metadata must come from YouTube API

Video plays inside the app (no YouTube redirect)

Working server endpoint returns enriched video list

Provide MongoDB connection URL & screen recording

🚀 Deployment
Web: Vercel

Server: Railway / Heroku

Mobile: Expo build → .apk / .aab / .ipa

📹 Screen Recording
📽️ Click here to watch demo (add your recording link here)

🙌 Credits
Built for LearnOverse Internship Assignment.
Made with ❤️ using React, React Native, Node.js & MongoDB.

📜 License
MIT License © 2025 MyTube

markdown
Copy code

---

✨ This README is **ready to paste** — just replace:  
- `https://via.placeholder.com/...` → with real screenshots  
- `MONGODB_URI` → with your connection string (if required)  
-


