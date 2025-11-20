import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";

import { connectDB } from "./database/db.js";

dotenv.config();

const app = express();

const __dirname = path.resolve(); // it means root directory of project

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: "50mb" })); // Parse JSON request bodies with 50mb limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded data with 50mb limit
app.use(cookieParser()); // Parse cookies

// Debug middleware to log request body
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
