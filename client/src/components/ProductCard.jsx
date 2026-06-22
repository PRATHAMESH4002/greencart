import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate, user, setShowUserLogin } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = Math.round(((product.price - product.offerPrice) / product.price) * 100);

  return product && (
    <div className="stagger-item px-2">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="product-card group relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105"
      >
        {/* Card Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl" />

        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Main Content */}
        <div className="relative p-3 md:p-4 h-full flex flex-col">
          {/* Image Container with Effects */}
          <div className="relative mb-3 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center aspect-square group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300">
            {/* Background Decorative Blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl" />

            {/* Product Image */}
            <img
              className="product-card-image relative z-10 max-w-[90px] md:max-w-[120px] object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              src={product.image[0]}
              alt={product.name}
            />

            {/* Badges Container */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
              {/* Discount Badge */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg badge-pop">
                -{discountPercent}%
              </div>

              {/* New Badge */}
              <div className="bg-gradient-to-r from-primary to-primary-dull text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg animate-pulse">
                Fresh
              </div>
            </div>

            {/* Hover Action Icons */}
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20 backdrop-blur-sm rounded-xl animate-fadeIn z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  }}
                  className="p-2 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110"
                  title="View Details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Category Tag */}
          <div className="mb-2 inline-block">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    className="w-3 md:w-3.5 opacity-80 hover:opacity-100 transition-opacity"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt=""
                  />
                ))}
            </div>
            <span className="text-xs text-gray-500 font-medium ml-1">(237)</span>
          </div>

          {/* Price Section */}
          <div className="mb-3 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-primary price-highlight">
                {currency}{product.offerPrice}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {currency}{product.price}
              </span>
            </div>
            <p className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block">
              Save {currency}{(product.price - product.offerPrice).toFixed(2)}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {product.inStock ? (
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                In Stock
              </span>
            ) : (
              <span className="text-xs font-bold text-orange-600">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button - Flexed */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-auto"
          >
            {!cartItems[product._id] ? (
              <button
                onClick={() => {
                  user ? addToCart(product._id) : setShowUserLogin(true);
                }}
                className="w-full py-2.5 md:py-3 px-3 bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 active:scale-95 flex items-center justify-center gap-2 group/btn"
              >
                <svg className="w-5 h-5 transition-transform group-hover/btn:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-1-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                Add to Cart
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-gradient-to-r from-primary to-primary-dull text-white p-1 rounded-lg border border-primary/30 shadow-lg">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="flex-1 py-2 px-2 hover:bg-primary-dull/80 rounded transition-colors duration-200 text-lg font-bold"
                >
                  −
                </button>
                <span className="flex-1 text-center font-bold text-base quantity-change">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex-1 py-2 px-2 hover:bg-primary-dull/80 rounded transition-colors duration-200 text-lg font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;