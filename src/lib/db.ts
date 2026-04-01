import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Use a global variable to cache the connection across hot reloads in dev
// and across serverless function invocations in production
let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Start a new connection if none is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10s timeout for Atlas
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, fixes some Atlas connection issues
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      console.log('✅ MongoDB connected to Atlas');
      return m;
    }).catch((err) => {
      cached.promise = null; // Reset so next call retries
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
