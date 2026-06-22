import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Loading from "./components/Loading";
import ChatBot from "./components/ChatBot";

import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";

import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import Order from "./pages/seller/Order";
import ProductList from "./pages/seller/ProductList";

import { useAppContext } from "./context/AppContext";

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");

  const { showUserLogin, isSeller } = useAppContext();

  return (
<div className="text-default min-h-screen text-gray-700 bg-transparent">

      
      {/* Navbar (hidden on seller pages) */}
      {!isSellerPath && <Navbar />}

      {/* Login Modal */}
      {showUserLogin && <Login />}

      {/* Toast Notifications */}
      <Toaster position="top-right" />

      {/* Main Content */}
<div
  className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"} page-card fade-in`}
>
        
        {/* PAGE TRANSITIONS */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/loader" element={<Loading />} />

            {/* Seller Routes */}
            <Route
              path="/seller"
              element={isSeller ? <SellerLayout /> : <SellerLogin />}
            >
              <Route index element={<AddProduct />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Order />} />
            </Route>

          </Routes>
        </AnimatePresence>
      </div>

      {/* ChatBot (only for users, not seller) */}
      {!isSellerPath && <ChatBot />}

      {/* Footer */}
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
