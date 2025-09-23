import express from "express";
import { validationResult, body } from "express-validator";
import bcrypt from "bcrypt";
import { generateAccessToken, verifyToken } from "../config/jwt.js";
import router from "./user.js";
import cookieParser from "cookie-parser";
const authRoutes = express.Router();

authRoutes.post(
  "/register",
  [
    body("userName")
      .isLength({ min: 3, max: 10 })
      .withMessage("username must be betwen the 3 and 20"),
    body("email").isEmail().withMessage("email is not valid"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("password must be of at least of 5 letters"),
  ],
  async (req, res) => {
    const { userName, password, firstName, lastName, email } = req.body;

    if (!userName || !password || !firstName || !lastName || !email) {
      res.status(400).json("all fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const generateToken = generateAccessToken(email);

    if (!hashedPassword) {
      res.status(500).json("something went worng while hashing the password");
    }

    res.status(201).json({
      userName,
      password,
      firstName,
      lastName,
      generateToken,
    });
  }
);

authRoutes.post(
  "/login",
  [
    body("userName")
      .isLength({ min: 3, max: 10 })
      .withMessage("username must be betwen the 3 and 20"),
    body("email").isEmail().withMessage("email is not valid"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("password must be of at least of 5 letters"),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json("both field are required");
      }

      const dummyPassword = "hussain";

      const decodedPassword = bcrypt.compare(dummyPassword, password);

      if (!dummyPassword) {
        res.status(500).json("error caugh while generating passwrod");
      }

      const generateToken = generateAccessToken(email);

      res.status(200).cookie("token", generateToken).json({
        message: "User login sucesssfully!",
        token: generateToken,
      });
    } catch (error) {
      console.log(`error caugh while loging user`, error.message);
    }
  }
);

authRoutes.post("/logout", async (req, res) => {
  try {
    res.status(200).clearCookie("token").json("user logout sucessfully!");
  } catch (error) {
    console.log(`some error caught while logouting teh user ${error.message}`);
  }
});

authRoutes.get("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "No token, please login" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user: decoded,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

authRoutes.put("/profile", async (req, res) => {
  try {
    // 1. Get token from cookies or headers
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token, please login" });
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const { firstName, lastName, email, currentPassword, newPassword } =
      req.body;

    let user = {
      userName: decoded.userName || "demoUser",
      email: decoded.email,
      firstName: decoded.firstName || "John",
      lastName: decoded.lastName || "Doe",
      passwordHash: await bcrypt.hash("hussain", 10), // dummy stored password
    };

    // 4. Apply updates
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Current password is required to set a new one" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const newToken = generateAccessToken({
      userName: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res
      .status(200)
      .cookie("token", newToken, { httpOnly: true, sameSite: "strict" })
      .json({
        message: "Profile updated successfully",
        user: {
          userName: user.userName,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default authRoutes;
