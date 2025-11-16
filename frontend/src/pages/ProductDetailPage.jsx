import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const [product, setProduct] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.", { id: "login" });
      return;
    } else {
      await addToCart(product);
    }
  };

  useEffect(() => {
    // Find the product from the store
    const foundProduct = products.find((p) => p._id === id);
    setProduct(foundProduct);
  }, [id, products]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image with Zoom */}
          <div
            className="bg-gray-800 rounded-lg overflow-hidden relative cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover transition-transform duration-300"
              style={{
                transform: isZoomed ? "scale(2)" : "scale(1)",
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-emerald-400">
                  BDT {product.price.toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm capitalize">
                  {product.category}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {product.isFeatured && (
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                    ⭐ Featured Product
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
