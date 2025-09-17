// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import Book from '../models/book.model.js'
import User from '../models/user.model.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const dbConnect = async () => {
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
  console.log("database connected successfully");
};

const seed = async () => {
  try {
    console.log("clearing existing data...");
    await User.deleteMany({});
    await Book.deleteMany({});

    const users = await User.insertMany([
      {
        username: "muhammed",
        email: "muhammed@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "muhammed",
        lastName: "ahmed",
      },
      {
        username: "kaleem",
        email: "kaleem@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "kaleem",
        lastName: "ullah",
      },
      {
        username: "urva",
        email: "urva@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "urva",
        lastName: "khan",
      },
      {
        username: "sara_khan",
        email: "sara@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Sara",
        lastName: "Khan",
      },
      {
        username: "ali_ahmed",
        email: "ali@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Ali",
        lastName: "Ahmed",
      },
    ]);

    console.log("user inserted");

    console.log("inserting sample books...");
    const genres = ["Fiction", "Science", "History", "Fantasy", "Biography"];
    const books = [];

    for (let i = 1; i <= 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      const year = 1990 + Math.floor(Math.random() * 30);

      books.push({
        title: `Sample Book ${i}`,
        author: `Author ${i}`,
        year,
        genre: randomGenre,
        isbn: `ISBN-${1000 + i}`,
        userId: randomUser._id,
      });
    }

    await Book.insertMany(books);
    console.log("Books inserted");

    process.exit(0);
  } catch (err) {
    console.error("seeding is failed:", err.message);
    process.exit(1);
  }
};

dbConnect().then(seed);
