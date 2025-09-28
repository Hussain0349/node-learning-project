import request from "supertest";
import app from "../server.js";  

describe("Security Tests", () => {
  it("should prevent invalid email registration", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "baduser",
      email: "notanemail",
      password: "Passw0rd!",
      firstName: "Bad",
      lastName: "User",
    });

    expect(res.statusCode).toBe(400);
  });
});
