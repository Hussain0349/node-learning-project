// node-part-2/src/test/database.test.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URL);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Database Tests", () => {
  it("should create a user", async () => {
    const user = await User.create({
      username: "hussain123",
      email: "hussain@example.com",
      password: "password123",
      firstName: "Hussain",
      lastName: "Khan",
    });
    expect(user.username).toBe("hussain123");
    expect(user.email).toBe("hussain@example.com");
  });

  it("should not allow duplicate email", async () => {
    await expect(
      User.create({
        username: "duplicateuser",
        email: "hussain@example.com", // already used above
        password: "password123",
        firstName: "Dup",
        lastName: "User",
      })
    ).rejects.toThrow();
  });

  it("should create a book linked to user", async () => {
    const user = await User.findOne({ email: "hussain@example.com" });
    const book = await Book.create({
      title: "Test Book",
      author: "Some Author",
      year: 2024,
      genre: "Tech",
      userId: user._id, // correct foreign key
    });
    expect(book.userId.toString()).toBe(user._id.toString());
  });

  it("should fail with invalid book data", async () => {
    await expect(Book.create({ title: "" })).rejects.toThrow();
  });
});
