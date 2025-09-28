import request from "supertest";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "../server.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { jest } from "@jest/globals";

jest.setTimeout(20000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let mongoServer;
let userId;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const registerRes = await request(app).post("/api/v1/auth/register").send({
    username: "apitest",
    email: "apiuser@example.com",
    password: "password123",
    firstName: "API",
    lastName: "User",
  });

  userId = registerRes.body._id;

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: "apiuser@example.com",
    password: "password123",
  });

  token =
    loginRes.body.token ||
    (loginRes.headers["set-cookie"]?.[0]?.split(";")[0].split("=")[1]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("API Tests", () => {
  it("should return 200 on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  it("should fetch created user", async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("apiuser@example.com");
  });

  it("should create a book via API", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`) // ✅ send token
      .send({
        title: "API Test Book",
        author: "API Author",
        year: 2025,
        isbn: "h",
        genre: "Testing",
        userId,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("API Test Book");
  });
});
