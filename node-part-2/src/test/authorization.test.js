import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Authorization Middleware", () => {
  it("should block access to protected route without token", async () => {
    const res = await request(app).get("/api/v1/books");
    expect(res.statusCode).toBe(401);
  });

  it("should require token for creating book", async () => {
    const res = await request(app).post("/api/v1/books").send({
      title: "Test Book",
      author: "Author",
      year: 2024,
      genre: "Fiction",
      isbn: "1234567890",
    });
    expect(res.statusCode).toBe(401);
  });
});
