import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch cart items. Please try again.",
      );
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart successfully!");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart. Please try again.",
      );
    }
  },

  removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },

 updateQuantity: async (productId, quantity) => {
  if (quantity == 0) {
    await get().removeFromCart(productId);
    return;
  } else {
    await axios.put(`/cart/${productId}`, { quantity });
    await get().getCartItems(); // <-- Always refresh from backend!
    get().calculateTotals();
  }
 },


  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ); // reduce because we are calculating single value from array
    let total = subtotal;
    if (coupon) {
      total = total - (total * coupon.discount) / 100;
    }
    set({ subtotal, total });
  },
}));
