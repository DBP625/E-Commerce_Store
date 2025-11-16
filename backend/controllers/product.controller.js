import Product from "../models/product.model.js";
import redis from "../database/redis.js";
import cloudinary from "../database/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      console.log("Featured products fetched from cache");
      return res.json({ products: JSON.parse(featuredProducts) });
    }
    //if not in cache, fetch from DB
    //lean returns plain JS objects instead of Mongoose documents
    const products = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    //store in redis cache for future requests
    await redis.set("featuredProducts", JSON.stringify(products)); //cache for 1 hour
    res.json({ products }); // means return products as json response
  } catch (error) {
    console.log("Error fetching featured products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
      category,
    });
    res.status(201).json({ product, message: "Product created successfully" });
  } catch (error) {
    console.log("Error creating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // Extract public ID from URL
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary:", error.message);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 5 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          category: 1,
        },
      },
    ]);
  } catch (error) {
    console.log("Error fetching recommended products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  console.log("Fetching products for category:", category);
  try {
    const products = await Product.find({ category });
    console.log(`Found ${products.length} products for category: ${category}`);
    res.json({ products });
  } catch (error) {
    console.log("Error fetching products by category:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured; // feature to not feature toggle so that admin can feature and unfeature
      const updatedProduct = await product.save(); // why save? To persist the changes to the database
      await updatedProductCache(); // update cache after toggling
      res.json({
        product: updatedProduct, // res.json means sending a JSON response to the client
        message: "Product feature status toggled successfully",
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error toggling featured product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatedProductCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error updating product cache:", error.message);
  }
};
