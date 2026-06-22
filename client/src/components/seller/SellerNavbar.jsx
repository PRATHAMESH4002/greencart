import React from "react";

const SellerNavbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "add", label: "Add Product", icon: "➕" },
    { id: "list", label: "Product List", icon: "📦" },
    { id: "orders", label: "Orders", icon: "🧾" },
  ];

  return (
    <div className="slide-in-left sticky top-0 z-40 p-4 md:p-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-8">
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative px-4 md:px-6 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300 flex items-center gap-2 overflow-hidden ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary via-primary to-primary-dull text-white shadow-lg hover:shadow-xl scale-105"
                : "bg-white/40 text-gray-700 hover:bg-white/70 hover:text-primary border border-gray-200/50 hover:border-primary/30"
            }`}
          >
            {/* Animated background */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon & Text */}
            <span className="text-lg relative z-10">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>

            {/* Active indicator */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SellerNavbar;