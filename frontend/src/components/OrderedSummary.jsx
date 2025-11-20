import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useNavigate } from "react-router-dom";
import SslCommerzPayment from "sslcommerz-lts/api/payment-controller";

const OrderedSummary = () => {
  const { total, subtotal, coupon, isCouponApplied } = useCartStore();
  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  const navigate = useNavigate();

  const handleReview = () => {
    navigate("/checkout/review");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order Summary</p>
      <div className="space-y-4">
        <dl className="flex items-center justify-between gap-4">
          <dt className="text base font-normal text-gray-300">
            Original Price
          </dt>
          <dd className="text base font-medium text-white">
            BDT. {formattedSubtotal}
          </dd>
        </dl>

        {/* {coupon && isCouponApplied && (
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Coupon ({coupon.code})
            </dt>
            <dd className="text-base font-medium text-emerald-400">
              -{coupon.discountPercentage}%
            </dd>
          </dl>
        )} */}
        <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
          <dt className="text-base font-bold text-white">Total</dt>
          <dd className="text-base font-bold text-emerald-400">
            BDT. {formattedTotal}
          </dd>
        </dl>
        <div className="pt-4">
          <button
            onClick={handleReview}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2 px-4 rounded-md"
          >
            Review & Checkout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderedSummary;
