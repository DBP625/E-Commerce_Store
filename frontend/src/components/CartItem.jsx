import React from "react";
import { Minus , Plus , Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
const CartItem = () => {
    const {removeFromCart, updateQuantity} = useCartStore();
  return (
  )
};

export default CartItem;
