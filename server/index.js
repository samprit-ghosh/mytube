// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const app = express();
app.use(cors());

const mongoUri = process.env.MONGO_URI; // must include DB name at the end
const client = new MongoClient(mongoUri);
const YT_API_KEY = process.env.YT_API_KEY;

let videosCollection; // will hold our collection reference once connected

// Connect to MongoDB once at startup
async function startServer() {
  try {
    await client.connect();
    const db = client.db(); // uses the DB name from the URI
    videosCollection = db.collection('videos');

    app.listen(4000, () => {
      console.log('✅ Server running on http://localhost:4000');
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}

app.get('/videos', async (req, res) => {
  try {
    // Fetch video IDs from MongoDB
    const videoDocs = await videosCollection.find({}).toArray();
    
    // Check if we have any videos
    if (videoDocs.length === 0) {
      return res.status(404).json({ error: 'No videos found in database' });
    }
    
    const ids = videoDocs.map((v) => v.videoId).join(',');

    // Fetch details from YouTube API
    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id: ids,
        key: YT_API_KEY,
      },
    });

    // Check if YouTube API returned any items
    if (!ytRes.data.items || ytRes.data.items.length === 0) {
      return res.status(404).json({ error: 'No videos found from YouTube API' });
    }

    res.json(ytRes.data.items);
  } catch (err) {
    console.error('Error in /videos endpoint:', err);
    
    // More specific error handling
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('YouTube API error:', err.response.data);
      return res.status(502).json({ 
        error: 'YouTube API error', 
        details: err.response.data 
      });
    } else if (err.request) {
      // The request was made but no response was received
      console.error('No response from YouTube API');
      return res.status(503).json({ error: 'No response from YouTube API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', err.message);
      return res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
});

// Start the server
startServer();