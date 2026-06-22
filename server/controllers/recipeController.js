const Recipe = require("../models/Recipe");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { recipes } = require("../data/recipes");

/**
 * @desc    Get all recipes (from DB or seed)
 * @route   GET /api/recipes
 * @access  Public
 */
const getRecipes = async (req, res) => {
  try {
    const dbRecipes = await Recipe.find();

    // If DB empty, fallback to seed data
    if (dbRecipes.length === 0) {
      return res.json(recipes);
    }

    res.json(dbRecipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

/**
 * @desc    Add recipe ingredients to cart
 * @route   POST /api/recipes/add-to-cart/:id
 * @access  Private
 */
const addRecipeToCart = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Find recipe (DB first, fallback to seed)
    let recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      recipe = recipes.find(r => r._id === recipeId);
    }

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    for (const ing of recipe.ingredients) {
      const product = await Product.findOne({
        name: { $regex: ing.name, $options: "i" }
      });

      if (!product) continue;

      let qty = 1;
      if (typeof ing.quantity === "string" && ing.quantity.includes("g")) {
        qty = Math.ceil(parseInt(ing.quantity) / 500);
      } else {
        qty = parseInt(ing.quantity) || 1;
      }

      const existingItem = cart.items.find(
        item => item.product.toString() === product._id.toString()
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({
          product: product._id,
          quantity: qty
        });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: "Recipe ingredients added to cart"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRecipes,
  addRecipeToCart
};
