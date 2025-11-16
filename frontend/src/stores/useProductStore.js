import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [], // Initial empty array of products
  Loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ Loading: true });
    try {
      const response = await axios.post("/products", productData);
      set((PrevState) => ({
        products: [...PrevState.products, response.data],
        Loading: false,
      }));
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Product creation failed. Please try again.",
      );
      set({ Loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ Loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, Loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch products. Please try again.",
        Loading: false,
      });
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products. Please try again.",
      );
    }
  },

  fetchProductByCategory: async (category) => {
    set({ Loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, Loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch products by category. Please try again.",
        Loading: false,
      });
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products by category. Please try again.",
      );
    }
  },

  deleteProduct: async (productId) => {
    set({ Loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((PrevState) => ({
        products: PrevState.products.filter(
          (product) => product._id !== productId,
        ),
        Loading: false,
      }));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Product deletion failed. Please try again.",
      );
      set({ Loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ Loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((PrevProduct) => ({
        products: PrevProduct.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.product.isFeatured }
            : product,
        ),
        Loading: false,
      }));
      toast.success("Product featured status updated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update product status.",
      );
      set({ Loading: false });
    }
  },
}));
