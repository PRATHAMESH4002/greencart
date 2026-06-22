import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const Order = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) =>
          filter === "paid" ? order.isPaid : !order.isPaid
        );

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto pb-10">
      <div className="md:p-10 p-6">
        {/* Header */}
        <div className="fade-in mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🧾 Orders</h2>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="slide-in-left flex gap-3 mb-8">
          {[
            { id: "all", label: "All Orders" },
            { id: "paid", label: "Paid" },
            { id: "pending", label: "Pending" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === btn.id
                  ? "bg-gradient-to-r from-primary to-primary-dull text-white shadow-lg"
                  : "bg-white/60 text-gray-700 border border-gray-200 hover:bg-white/80"
              }`}
            >
              {btn.label} ({
                btn.id === "all"
                  ? orders.length
                  : btn.id === "paid"
                  ? orders.filter((o) => o.isPaid).length
                  : orders.filter((o) => !o.isPaid).length
              })
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="space-y-5">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div
                key={order._id}
                className="stagger-item p-6 bg-white/70 backdrop-blur border border-gray-200/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items Section */}
                  <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <img src={assets.box_icon} alt="box" className="w-5 h-5" />
                      Items
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-primary font-bold mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-800 mb-3">📍 Delivery To</h3>
                    <div className="text-sm space-y-1 text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                      <p className="font-medium">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.address.street}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.address.city}, {order.address.state}{" "}
                        {order.address.zipcode}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.address.country}
                      </p>
                      <p className="font-medium text-gray-800 mt-2">
                        ☎️ {order.address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        💳 Order Info
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-primary">
                            {currency}
                            {order.amount}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium">{order.paymentType}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                          order.isPaid
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300"
                            : "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-300"
                        }`}
                      >
                        {order.isPaid ? "✓ Paid" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl">📭</p>
              <p className="text-gray-500 mt-2">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;