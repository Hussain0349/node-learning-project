import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const registerRes = await request(app).post("/api/v1/auth/register").send({
    username: "integration",
    email: "integration@test.com",
    password: "Passw0rd!",
    firstName: "Integration",
    lastName: "Test",
  });

  userId = registerRes.body._id;

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: "integration@test.com",
    password: "Passw0rd!",
  });

  token =
    loginRes.body.token ||
    (loginRes.headers["set-cookie"]?.[0]?.split(";")[0].split("=")[1]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Integration Flow", () => {
  it("should create a book for logged-in user", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`) // ✅ send token
      .send({
        title: "Integration Book",
        author: "Author",
        year: 2024,
        genre: "Fiction",
        isbn: "0987654321",
        userId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Integration Book");
  });
});
