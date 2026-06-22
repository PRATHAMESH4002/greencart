const express = require("express");
const router = express.Router();

const {
  getRecipes,
  addRecipeToCart
} = require("../controllers/recipeController");

const auth = require("../middlewares/auth");

// Get all recipes
router.get("/", getRecipes);

// Add recipe ingredients to cart
router.post("/add-to-cart/:id", auth, addRecipeToCart);

module.exports = router;
