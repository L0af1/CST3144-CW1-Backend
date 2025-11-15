import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db("tutorconnect");  
    console.log("Connected to MongoDB, YIPPEEE!!!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export function getDB() {
  return db;
}