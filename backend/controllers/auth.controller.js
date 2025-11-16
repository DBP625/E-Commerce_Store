import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../database/redis.js";
import crypto from "crypto";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}; // it is a function that generates JWT access and refresh tokens for a given user ID.

const storeRefreshToken = async (userId, refreshToken) => {
  // Store the refresh token in Redis with the user ID as the key
  await redis.set(`refresh_token:${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60,
  }); // Set expiration to 7 days
};

const setCookie = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //PREVENT CLIENT SIDE JS ACCESSING THE COOKIE, cross-site scripting (XSS) protection
    secure: process.env.NODE_ENV === "production", //ONLY SEND COOKIE OVER HTTPS IN PRODUCTION
    sameSite: "Strict", //PREVENT CSRF ATTACKS BY NOT SENDING COOKIES WITH CROSS-SITE REQUESTS
    maxAge: 15 * 60 * 1000, //15 MINUTES
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 DAYS
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("Signup request received:", { name, email }); // Debug log

    const userExists = await User.findOne({ email }); // Check if user with the given email already exists
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    console.log("User created:", user._id); // Debug log

    //authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error); // Better error logging

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages[0] }); // Send first validation error
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email }); // Debug log

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // User authenticated
      console.log("User authenticated:", user._id); // Debug log
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookie(res, accessToken, refreshToken);

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Login successful",
      });
    } else {
      console.log("Login failed: Invalid credentials for", email); // Debug log
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error); // Better error logging
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh token from cookie:", refreshToken); // Debug

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      console.log("Decoded userId:", decoded.userId); // Debug

      const deleted = await redis.del(`refresh_token:${decoded.userId}`);
      console.log("Deleted from Redis:", deleted); // Debug (1 = success, 0 = not found)
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error); // Debug
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.json({ message: "Access token refreshed successfully" });
  } catch (error) {
    console.error("Refresh token error:", error); // Debug
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//TODO Implement getProfile
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};