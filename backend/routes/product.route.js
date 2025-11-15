import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
// Admin can get all products
// But user cannot get all products , so we use adminRoute middleware

router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendedProducts);

router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); // patch is used to update part of the resource
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
export default router;
