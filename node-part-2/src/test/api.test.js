// node-part-2/src/test/api.test.js
import request from "supertest";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "../server.js";   // server.js already connects to DB
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

beforeAll(async () => {
  //  remove mongoose.connect here
  // server.js already did it
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("API Tests", () => {
  let userId;

  it("should return 200 on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  it("should create a user via API", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        username: "apitest",
        email: "apiuser@example.com",
        password: "password123",
        firstName: "API",
        lastName: "User",
      });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe("apitest");
    userId = res.body.id || res.body._id;
  });

  it("should fetch created user", async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("apiuser@example.com");
  });

  it("should create a book via API", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .send({
        title: "API Test Book",
        author: "API Author",
        year: 2025,
        genre: "Testing",
        userId,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("API Test Book");
  });
});
