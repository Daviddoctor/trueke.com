const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);