const mongoose = require("mongoose");

const productScehma = new mongoose.Schema({
    // "title": String,
    // "description": String,
    // "price": Number,
    // "image": String,
    // "category": String,
    // "rating":Object,
  
    title: { type: String, required: true },
    description: { type: String},
    price: {
      type: Number,
      required: {
        value: true,
        message: "Opps , wher is price ?",
      },
      min: [0, "Price must be greater than 0"],
    },
    image: String,
    category: String,
    rating: Object,
  });
  
  const Proudcts = mongoose.model("products", productScehma);

  module.exports = Proudcts;