import React from "react";
import { assets, categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium fade-in">Categories</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="stagger-item group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center category-card transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: category.bgColor,
              backdropFilter: "blur(10px)",
            }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-110 transition-transform duration-300 max-w-28"
            />
            <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300">
              {category.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;