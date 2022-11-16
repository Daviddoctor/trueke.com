const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);