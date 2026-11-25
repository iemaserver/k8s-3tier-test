const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://bikeapp:bikeapp123@localhost:27017/bikesdb?authSource=bikesdb';

// Retry so the backend survives starting before MongoDB is ready
async function connectDB(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

module.exports = connectDB;
