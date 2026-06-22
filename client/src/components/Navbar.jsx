import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const isSellerPage = location.pathname.startsWith("/seller");

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) navigate("/products");
  }, [searchQuery]);

  const sellerTabClass = (path) =>
    location.pathname === path
      ? "text-primary border-primary"
      : "text-gray-500 hover:text-primary border-transparent";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* TOP NAV */}
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img className="h-9" src={assets.logo} alt="GreenCart" />
        </NavLink>

        {/* DESKTOP MENU */}
        <div className="hidden sm:flex items-center gap-7 text-sm font-medium">
          <NavLink
            to="/seller"
            className="px-4 py-1.5 rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition"
          >
            Seller Dashboard
          </NavLink>

          <NavLink className="hover:text-primary" to="/">
            Home
          </NavLink>
          <NavLink className="hover:text-primary" to="/products">
            Products
          </NavLink>
          <NavLink className="hover:text-primary" to="/">
            Contact
          </NavLink>

          {/* SEARCH */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border bg-gray-50">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-36"
              type="text"
              placeholder="Search..."
            />
            <img src={assets.search_icon} className="w-4 opacity-60" />
          </div>

          {/* CART */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer hover:scale-105 transition"
          >
            <img src={assets.nav_cart_icon} className="w-6" />
            <span className="absolute -top-2 -right-3 text-[10px] text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          {/* AUTH */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-6 py-2 rounded-full bg-primary text-white hover:opacity-90 transition"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-10 cursor-pointer"
              />
              <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-lg text-sm hidden group-hover:block">
                <li
                  onClick={() => navigate("/my-orders")}
                  className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SELLER SUB NAV */}
      {isSellerPage && (
        <div className="flex gap-10 px-6 md:px-16 lg:px-24 xl:px-32 py-3 bg-gray-50 text-sm font-semibold">
          <NavLink
            to="/seller/add"
            className={`border-b-2 pb-1 transition ${sellerTabClass("/seller/add")}`}
          >
            ➕ Add Product
          </NavLink>

          <NavLink
            to="/seller/products"
            className={`border-b-2 pb-1 transition ${sellerTabClass("/seller/products")}`}
          >
            📦 Product List
          </NavLink>

          <NavLink
            to="/seller/orders"
            className={`border-b-2 pb-1 transition ${sellerTabClass("/seller/orders")}`}
          >
            🧾 Orders
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
