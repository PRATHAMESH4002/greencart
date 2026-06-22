const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String, // "2", "500g"
    required: true
  }
});

const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: [ingredientSchema]
});

module.exports = mongoose.model("Recipe", recipeSchema);
