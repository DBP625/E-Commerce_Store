import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded mt-8">
      <h1 className="text-2xl font-bold text-yellow-400">Payment Cancelled</h1>
      <p className="mt-4 text-gray-200">You cancelled the payment process.</p>
      <Link
        to="/cart"
        className="inline-block mt-4 px-4 py-2 bg-gray-700 rounded text-white"
      >
        Return to cart
      </Link>
    </div>
  );
}
