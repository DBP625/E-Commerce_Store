import React from "react";
import { Link } from "react-router-dom";

export default function PaymentFail() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded mt-8">
      <h1 className="text-2xl font-bold text-red-400">Payment Failed</h1>
      <p className="mt-4 text-gray-200">
        Something went wrong while processing your payment.
      </p>
      <Link
        to="/cart"
        className="inline-block mt-4 px-4 py-2 bg-gray-700 rounded text-white"
      >
        Return to cart
      </Link>
    </div>
  );
}
