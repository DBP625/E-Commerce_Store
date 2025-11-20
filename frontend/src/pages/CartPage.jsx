import React from "react";
import { useCartStore } from "../stores/useCartStore";
import CartItem from "../components/CartItem";
import OrderedSummary from "../components/OrderedSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import { motion } from "framer-motion";
import { Gift, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="py-8 md:py-16 ">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-16">
                <ShoppingCart className="h-24 w-24 text-gray-400" />
                <h3 className="text-2xl font-semibold ">Your cart is empty</h3>
                <p className="text-gray-400">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                  className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600"
                  to="/"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}

            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>
          {cart.length > 0 && (
            <motion.div
              className="mt-8 w-full lg:mt-0 lg:ml-8 lg:w-80 flex-none"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderedSummary />
              <GiftCouponCard />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
