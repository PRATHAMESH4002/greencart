import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import PageWrapper from "../components/PageWrapper";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Cart = () => {
  const {
    user,
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    setCartItems,
    token,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  /* ---------------- CART DATA ---------------- */
  const getCart = () => {
    const tempArray = [];

    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({
          ...product,
          quantity: cartItems[key],
        });
      }
    }
    setCartArray(tempArray);
  };

  /* ---------------- USER ADDRESS ---------------- */
  const getUserAddress = async () => {
    try {
      const { data } = await axios.post(
        "/api/address/get",
        { userId: user._id },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      const orderPayload = {
        userId: user._id,
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
        amount: getCartAmount() + (getCartAmount() * 2) / 100,
      };

      /* ---------- CASH ON DELIVERY ---------- */
      if (paymentOption === "COD") {
        const { data } = await axios.post(
          "/api/order/cod",
          orderPayload,
          { headers: { Authorization: token } }
        );

        if (data.success) {
          toast.success("Order placed successfully");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }

      /* ---------- RAZORPAY ONLINE PAYMENT ---------- */
      if (paymentOption === "Online") {
        const { data: razorOrder } = await axios.post(
          "/api/payment/create-order",
          { amount: orderPayload.amount },
          { headers: { Authorization: token } }
        );

        const options = {
          key: "rzp_test_SDC3SE9wPcdKbY", // 🔴 replace with your TEST key
          amount: razorOrder.amount,
          currency: "INR",
          name: "GreenCart",
          description: "Grocery Purchase",
          order_id: razorOrder.id,
          handler: async function (response) {
            const verifyRes = await axios.post(
              "/api/payment/verify-payment",
              response,
              { headers: { Authorization: token } }
            );

            if (verifyRes.data.success) {
              await axios.post(
                "/api/order/online",
                {
                  ...orderPayload,
                  paymentId: response.razorpay_payment_id,
                },
                { headers: { Authorization: token } }
              );

              toast.success("Payment successful 🎉");
              setCartItems({});
              navigate("/my-orders");
            } else {
              toast.error("Payment verification failed");
            }
          },
          theme: {
            color: "#22c55e",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (products.length && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  if (!products.length || !cartItems) return null;

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row mt-16 gap-12">
        {/* LEFT CART */}
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-medium mb-6">
            Shopping Cart{" "}
            <span className="text-sm text-primary">
              {getCartCount()} Items
            </span>
          </h1>

          {cartArray.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[2fr_1fr_1fr] items-center pt-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover border"
                />

                <div>
                  <p className="font-semibold">{product.name}</p>
                  <select
                    value={cartItems[product._id]}
                    onChange={(e) =>
                      updateCartItem(product._id, Number(e.target.value))
                    }
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-center">
                {currency}
                {product.offerPrice * product.quantity}
              </p>

              <button onClick={() => removeFromCart(product._id)}>
                <img src={assets.remove_icon} alt="remove" className="w-6" />
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full max-w-[360px] border p-5 bg-gray-100/40">
          <h2 className="text-xl font-medium">Order Summary</h2>

          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border px-3 py-2 mt-4"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>

          <button
            onClick={placeOrder}
            className="w-full py-3 mt-6 bg-primary text-white"
          >
            {paymentOption === "COD"
              ? "Place Order"
              : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Cart;
