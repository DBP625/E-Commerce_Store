import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // send reset email logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-xl text-emerald-400 font-bold mb-4">
          Reset Password
        </h2>

        <input
          type="email"
          className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
