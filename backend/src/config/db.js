import mongoose from 'mongoose';
import { mockStore } from '../data/mockStore.js';

let mongoMemoryServer = null;

export const connectDB = async (customUri = null) => {
  mockStore.init();

  const uri = customUri || process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 3000
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`⚠️ External MongoDB could not be reached (${error.message}). Using In-Memory Store.`);
    }
  } else {
    console.log('⚡ Running with Instant Zero-Latency In-Memory Database Store.');
  }

  return null;
};

export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error('Error disconnecting DB:', error);
  }
};
