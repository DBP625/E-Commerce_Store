import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// protectRoute middleware is used
// to protect routes in your backend (so only authenticated users can access them).

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); // It means the token is valid and not expired
      const user = await User.findById(decoded.userId).select("-password"); // Fetch user details excluding password

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }
      req.user = user; // Attach user to request object
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, continue
  } else {
    return res.status(403).json({ message: "Access-denied - Admin only" });
  }
};
