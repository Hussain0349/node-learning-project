// scripts/migrate.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Book from '../models/book.model.js'
import User from '../models/user.model.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
    console.log("Database is connected");
  } catch (err) {
    console.error("Database is not connected", err.message);
    process.exit(1);
  }
};

const migrate = async () => {
  try {
    console.log("Running");

    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });

    
    await Book.collection.createIndex({ title: "text", author: "text" });
    await Book.collection.createIndex({ userId: 1 });
    await Book.collection.createIndex({ genre: 1, year: 1 });

    console.log("index is created successfully");
    process.exit(0);
  } catch (error) {
    console.error("migration is failed duw to some error", error.message);
    process.exit(1);
  }
};

dbConnect().then(migrate);
