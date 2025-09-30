// scripts/prod-setup.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "node-part-2/.env" });

// --- Define schemas ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash in real app
  role: { type: String, enum: ["admin", "user"], default: "user" },
    isbn: { type: String, unique: true } 
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,

});

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);

async function seedDatabase() {
  try {
    // Connect to Atlas
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
    console.log("✅ Connected to MongoDB Atlas for seeding");

    // 1) Create Admin user if not exists
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: "admin123", // ⚠️ plain-text just for demo!
        role: "admin",
        
      });
      console.log("👤 Admin user created (username: admin / password: admin123)");
    } else {
      console.log("👤 Admin user already exists, skipping");
    }

    // 2) Insert sample books if collection empty
    const booksCount = await Book.countDocuments();
    if (booksCount === 0) {
      await Book.insertMany([
        { title: "Clean Code", author: "Robert C. Martin", year: 2008 },
        { title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999 },
        { title: "You Don’t Know JS", author: "Kyle Simpson", year: 2015 },
      ]);
      console.log("📚 Sample books inserted");
    } else {
      console.log("📚 Books already exist, skipping");
    }

    console.log("🎉 Database seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
