import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const { axios } = useAppContext();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (files.length === 0) {
        toast.error("Please upload at least one image");
        setLoading(false);
        return;
      }

      const productData = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/product/add", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto pb-10">
      <form onSubmit={onSubmitHandler} className="md:p-10 p-6 max-w-3xl">
        {/* Header */}
        <div className="fade-in mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">➕ Add New Product</h2>
          <p className="text-gray-500">Add a new product to your inventory</p>
        </div>

        {/* Image Upload Section */}
        <div className="slide-in-left space-y-4 mb-8 p-6 bg-white/60 backdrop-blur rounded-2xl border border-gray-200/50">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              📸 Product Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className="group relative cursor-pointer"
                  >
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 hover:border-primary transition-colors bg-gray-50 hover:bg-primary/5 p-2">
                      {files[index] ? (
                        <img
                          src={URL.createObjectURL(files[index])}
                          alt="Product"
                          className="w-full h-24 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-24 flex flex-col items-center justify-center">
                          <img
                            src={assets.upload_area}
                            alt="Upload"
                            className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            Image {index + 1}
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="slide-in-right space-y-6 p-6 bg-white/60 backdrop-blur rounded-2xl border border-gray-200/50">
          {/* Product Name */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter product name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={4}
              placeholder="Enter product description (one per line)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            >
              <option value="">Select a category</option>
              {categories.map((item, index) => (
                <option key={index} value={item.path}>
                  {item.path}
                </option>
              ))}
            </select>
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Original Price
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Offer Price
              </label>
              <input
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                type="number"
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Discount Display */}
          {price && offerPrice && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-700">
                  {Math.round(((price - offerPrice) / price) * 100)}% OFF
                </span>
                {" "} Save ₹{(price - offerPrice).toFixed(2)}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 glow-pulse"
          >
            {loading ? (
              <>
                <span className="icon-spin">⏳</span>
                Adding Product...
              </>
            ) : (
              <>
                <span>➕</span>
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;