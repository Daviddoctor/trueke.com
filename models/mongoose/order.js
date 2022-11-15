const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
    cart: { type: Object, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    paymentId: { type: String, required: true } // Generated by stripe (can be seen on each payment's dashboard).
});

module.exports = mongoose.model("Order", OrderSchema);