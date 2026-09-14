const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  const candidateUris = [process.env.MONGO_URI, 'mongodb://127.0.0.1:27017/ecommerce'].filter(Boolean);
  let lastError;

  for (const mongoUri of candidateUris) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 20000,
      });

      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastError = error;
    }
  }

  try {
    memoryServer = await MongoMemoryServer.create({
      replSet: { count: 1 },
    });
    const mongoUri = memoryServer.getUri();
    global.__MONGO_MEMORY_SERVER__ = memoryServer;
    console.log('Using in-memory MongoDB for local development');

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', lastError ? lastError.message : error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
