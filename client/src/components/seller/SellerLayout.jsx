import React from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { navigate } = useAppContext();

  const navLinks = [
    { name: "Add Product", path: "/seller", icon: "➕" },
    { name: "Product List", path: "/seller/product-list", icon: "📦" },
    { name: "Orders", path: "/seller/orders", icon: "🧾" },
  ];

  const logOut = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-4 bg-white">
        <Link to="/">
          <img className="cursor-pointer w-32 hover:scale-105 transition-transform" src={assets.logo} alt="logo" />
        </Link>
        <div className="flex items-center gap-4">
          <p className="font-medium text-gray-700">Hi! Admin</p>
          <button
            onClick={logOut}
            className="border border-red-300 rounded-full text-sm px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Horizontal Nav */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200">
        <div className="px-4 md:px-8 flex gap-2 md:gap-4 overflow-x-auto whitespace-nowrap">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 md:px-6 py-3 font-medium transition-all ${
                  isActive ? "border-b-4 border-primary text-primary bg-primary/5" : "border-b-4 border-transparent text-gray-600 hover:text-primary hover:bg-primary/5"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="min-h-[calc(100vh-160px)] p-4">
        <Outlet />
      </main>
    </>
  );
};

export default SellerLayout;