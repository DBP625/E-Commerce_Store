import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get('order');

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded mt-8">
      <h1 className="text-2xl font-bold text-emerald-400">Payment Successful</h1>
      <p className="mt-4 text-gray-200">Thank you — your payment was successful.</p>
      {orderId && <p className="mt-2 text-gray-300">Order ID: {orderId}</p>}
      <Link to="/" className="inline-block mt-4 px-4 py-2 bg-emerald-500 rounded font-semibold text-black">Continue shopping</Link>
    </div>
  );
}
