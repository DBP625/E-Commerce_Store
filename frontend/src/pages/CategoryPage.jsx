import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, Link } from "react-router-dom";

const CategoryPage = () => {
  const { fetchProductByCategory, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductByCategory(category);
  }, [fetchProductByCategory, category]);
  console.log("Products in CategoryPage:", products);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8 capitalize">
          {category} Collection
        </h1>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-emerald-500/50 transition-shadow duration-300 cursor-pointer"
              >
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 ease-out hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-xl">
                      BDT {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-xl">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
