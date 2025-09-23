// scripts/drop.js
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
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
  console.log("database connected successfully");
};

const drop = async () => {
  try {
    
    await User.collection.drop().catch(() => console.log("user is not found"));
    await Book.collection.drop().catch(() => console.log("user is not found"));

    console.log("all collections dropped successfully");
    process.exit(0);
  } catch (err) {
    console.error("drop is failed", err.message);
    process.exit(1);
  }
};

dbConnect().then(drop);
