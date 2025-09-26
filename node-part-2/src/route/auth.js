import express from "express";
import { validationResult, body } from "express-validator";
import bcrypt from "bcrypt";
import { generateAccessToken, verifyToken } from "../config/jwt.js";
import cookieParser from "cookie-parser";
import User from "../models/user.model.js";

const authRoutes = express.Router();


authRoutes.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3, max: 20 })
      .withMessage("username must be between 3 and 20"),
    body("email").isEmail().withMessage("email is not valid"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, firstName, lastName, email } = req.body;

      if (!username || !password || !firstName || !lastName || !email) {
        return res.status(400).json("All fields are required");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);


      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // generate token
      const token = generateAccessToken({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      });

      // set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 15,
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: `Error registering user: ${error.message}` });
    }
  }
);


authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Both fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateAccessToken({
      id: user._id,
      username: user.username,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 15,
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
});


authRoutes.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json("User logged out successfully!");
  } catch (error) {
    res.status(500).json({ message: `Error logging out: ${error.message}` });
  }
});

authRoutes.get("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token, please login" });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(403).json({ error: "Invalid or expired token" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


authRoutes.put("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token, please login" });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(403).json({ error: "Invalid or expired token" });

    const { firstName, lastName, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set a new one" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    const newToken = generateAccessToken({
      id: user._id,
      username: user.username,
      email: user.email,
    });

    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 15,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
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

