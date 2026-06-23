import product from "../models/product.js";
import User from "../models/User.js";

export const chatBotReply = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.json({
        success: false,
        reply: "Please ask something about groceries or meals.",
      });
    }

    const userMessage = message.toLowerCase();
    let reply =
      "Sorry, I didn’t understand. Try asking about meals, groceries, health, or budget.";

    /* 1️⃣ SMART MEAL SUGGESTION */
    if (
      userMessage.includes("cook") ||
      userMessage.includes("meal") ||
      userMessage.includes("today")
    ) {
      reply =
        "You can cook Aloo Sabzi, Vegetable Khichdi, Tomato Curry, Dal Rice, or Vegetable Upma.";
    }

    /* 2️⃣ BUDGET */
    else if (userMessage.includes("budget")) {
      reply =
        "With a budget of ₹500, you can buy rice, dal, vegetables, milk, fruits, and bread.";
    }

    /* 3️⃣ HEALTH */
    else if (
      userMessage.includes("healthy") ||
      userMessage.includes("diet") ||
      userMessage.includes("weight") ||
      userMessage.includes("fitness")
    ) {
      reply =
        "For a healthy diet, choose oats, fruits, green vegetables, brown rice, nuts, and pulses.";
    }

    /* 4️⃣ SHOPPING LIST */
    else if (
      userMessage.includes("shopping list") ||
      userMessage.includes("grocery list") ||
      userMessage.includes("list")
    ) {
      reply =
        "Here is a 3-day grocery list: rice, dal, milk, vegetables, fruits, eggs, bread, and oil.";
    }

    /* 5️⃣ GROCERY HELP */
    else if (userMessage.includes("grocery")) {
      reply =
        "Daily groceries include rice, wheat, vegetables, fruits, milk, pulses, and snacks.";
    }

    /* 6️⃣ BREAKFAST */
    else if (userMessage.includes("breakfast")) {
      reply =
        "For breakfast, you can try milk, eggs, bread, oats, fruits, poha, or upma.";
    }

    /* ✅ VEGETABLES → ADD DIRECTLY TO USER CART */
    else if (userMessage.includes("vegetable")) {
      const vegetables = [
        "potato",
        "onion",
        "tomato",
        "spinach",
        "cabbage",
        "carrot",
        "beans",
      ];

      const products = await Product.find({
        name: { $regex: vegetables.join("|"), $options: "i" },
      });

      if (!userId) {
        return res.json({
          success: false,
          reply: "Please login to add items to cart.",
        });
      }

      const user = await User.findById(userId);

      if (!user.cartItems) {
        user.cartItems = {};
      }

      products.forEach((product) => {
        const productId = product._id.toString();
        user.cartItems[productId] =
          (user.cartItems[productId] || 0) + 1;
      });

      await user.save();

      reply =
        "🥕 Popular vegetables required for Veg Pulao (100 grams each):: potato, onion, tomato, spinach, cabbage, carrot, and beans.";
    }

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot Error:", error.message);
    return res.status(500).json({
      success: false,
      reply: "Internal server error",
    });
  }
};
