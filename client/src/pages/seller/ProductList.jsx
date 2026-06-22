import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return b.offerPrice - a.offerPrice;
      return 0;
    });

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto pb-10">
      <div className="md:p-10 p-6 space-y-6">
        {/* Header */}
        <div className="fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">📦 Product Inventory</h2>
          <p className="text-gray-500">Manage and monitor all your products</p>
        </div>

        {/* Controls */}
        <div className="slide-in-left flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 backdrop-blur p-4 rounded-xl border border-gray-200/50">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Table Container */}
        <div className="slide-in-right overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 hidden md:table-cell">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 hidden lg:table-cell">Price</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="stagger-item hover:bg-primary/5 transition-colors duration-200 group"
                  >
                    {/* Product Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate text-sm md:text-base">
                            {product.name}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            ID: {product._id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm">
                        <p className="font-bold text-primary">
                          {currency}
                          {product.offerPrice}
                        </p>
                        <p className="text-gray-500 line-through text-xs">
                          {currency}
                          {product.price}
                        </p>
                      </div>
                    </td>

                    {/* Stock Toggle */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={product.inStock}
                            onChange={() => toggleStock(product._id, !product.inStock)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-7 bg-gray-300 peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-primary-dull rounded-full transition-all duration-300 peer-checked:shadow-lg" />
                          <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 peer-checked:shadow-md" />
                          <span className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {product.inStock ? "In Stock" : "Out"}
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="slide-in-left p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <p className="text-gray-600 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-primary mt-2">{filteredProducts.length}</p>
          </div>
          <div className="slide-in-left p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20" style={{ animationDelay: "0.1s" }}>
            <p className="text-gray-600 text-sm font-medium">In Stock</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {filteredProducts.filter((p) => p.inStock).length}
            </p>
          </div>
          <div className="slide-in-left p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/20" style={{ animationDelay: "0.2s" }}>
            <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {filteredProducts.filter((p) => !p.inStock).length}
            </p>
          </div>
          <div className="slide-in-left p-4 bg-gradient-to-br from-primary-dull/10 to-primary-dull/5 rounded-xl border border-primary-dull/20" style={{ animationDelay: "0.3s" }}>
            <p className="text-gray-600 text-sm font-medium">Avg Price</p>
            <p className="text-3xl font-bold text-primary-dull mt-2">
              {currency}
              {Math.round(
                filteredProducts.reduce((acc, p) => acc + p.offerPrice, 0) /
                  filteredProducts.length
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;