import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_DB_CONNECTION_STRING ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_DB_URI;

if (!MONGO_URI) {
  console.warn("Warning: MONGO URI not defined in env (MONGO_DB_CONNECTION_STRING / MONGO_URI / MONGODB_URI).");
}

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGO_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;