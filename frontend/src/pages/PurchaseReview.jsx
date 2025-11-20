import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

export default function PurchaseReview() {
  const navigate = useNavigate();
  const { cart, total, subtotal, clearCart } = useCartStore();
  const { user } = useUserStore();

  const [shipping, setShipping] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postcode: "",
    country: "Bangladesh",
  });
  const [shippingMethod, setShippingMethod] = useState("NO");
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!shipping.phone || shipping.phone.trim().length < 6) {
      alert("Please enter a valid phone number (required by payment gateway).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        products: cart.map((p) => ({
          _id: p._id,
          quantity: p.quantity,
          price: p.price,
        })),
        customer: shipping,
        shipping_method: shippingMethod,
      };

      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create checkout session");

      if (data.orderId) localStorage.setItem("lastOrderId", data.orderId);

      if (data.gatewayUrl) {
        // redirect to gateway
        window.location.href = data.gatewayUrl;
      } else {
        throw new Error("No gateway URL returned");
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("Checkout failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center mt-8">
        No items in cart.{" "}
        <a href="/cart" className="text-emerald-400">
          Go back to cart
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        Review Your Purchase
      </h2>

      <section className="mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Items</h3>
        <ul className="mt-2 space-y-2">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between text-gray-100">
              <span>
                {item.name || "Product"} x {item.quantity}
              </span>
              <span>BDT {item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">
            Shipping & Contact
          </h3>
          <div className="mt-2 space-y-2">
            <input
              name="name"
              value={shipping.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <input
              name="phone"
              value={shipping.phone}
              onChange={handleChange}
              placeholder="Phone (required)"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <input
              name="address"
              value={shipping.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <div className="flex gap-2">
              <input
                name="city"
                value={shipping.city}
                onChange={handleChange}
                placeholder="City"
                className="flex-1 p-2 rounded bg-gray-700 text-white"
              />
              <input
                name="postcode"
                value={shipping.postcode}
                onChange={handleChange}
                placeholder="Postcode"
                className="w-32 p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <input
              name="country"
              value={shipping.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200">Order Summary</h3>
          <div className="mt-2 text-gray-100">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>BDT {subtotal}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Discount</span>
              <span>BDT 0</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-700 font-bold">
              <span>Total</span>
              <span>BDT {total}</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-gray-200">Shipping method</label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
            >
              <option value="NO">NO</option>
              <option value="Courier">Courier</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 rounded text-white"
        >
          Back
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="ml-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-black"
        >
          {loading ? "Redirecting..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
