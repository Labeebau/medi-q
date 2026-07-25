const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medi-q',
      {
        serverSelectionTimeoutMS: 3000, // Quick timeout check
      }
    );
    global.isMongoConnected = true;
    console.log(`[Medi-Q] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    global.isMongoConnected = false;
    console.log(`[Medi-Q] Notice: MongoDB local service not running (${error.message}).`);
    console.log('[Medi-Q] Defaulting to In-Memory Storage Mode. All APIs (Register, Login, Appointments) will work 100% for demonstration!');
  }
};

module.exports = connectDB;
