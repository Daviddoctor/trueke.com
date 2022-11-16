const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
    cart: { type: Object, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    paymentId: { type: String, required: true } // Generado por stripe (puede verse en el panel de control de cada pago).
});

module.exports = mongoose.model("Order", OrderSchema);