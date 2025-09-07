// server/seed.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

// Sample YouTube video IDs
const videoIds = [
  'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  'jNQXAC9IVRw', // Me at the zoo (first YouTube video)
  '9bZkp7q19f0', // PSY - GANGNAM STYLE
  'OPf0YbXqDm0', // Mark Ronson - Uptown Funk ft. Bruno Mars
  'kJQP7kiw5Fk', // Luis Fonsi - Despacito ft. Daddy Yankee
  'RgKAFK5djSk', // Wiz Khalifa - See You Again ft. Charlie Puth
  'YQHsXMglC9A', // Adele - Hello
  'AJtDXIazrMo', // Ed Sheeran - Shape of You
  'CevxZvSJLk8', // Katy Perry - Roar
  'ZyhrYis509A'  // Taylor Swift - Shake It Off
];

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db();
    const videosCollection = db.collection('videos');
    
    // Clear existing data
    await videosCollection.deleteMany({});
    
    // Insert new video IDs
    const documents = videoIds.map(videoId => ({ videoId }));
    const result = await videosCollection.insertMany(documents);
    
    console.log(`✅ Inserted ${result.insertedCount} video IDs into MongoDB`);
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seedDatabase();