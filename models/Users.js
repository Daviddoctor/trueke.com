const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
//const cart = require("./cart");

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.new},
    /*//ADD CART
    cart: {  
        items: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            quantity: { type: Number, required: true },
          },
    ],
      },  */ 
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash; 
};

UserSchema.methods.matchPassword = async function  (password) {
    return await bcrypt.compare(password, this.password);
};

/* //ADD CART - https://stackoverflow.com/questions/72219881/how-to-resolve-the-error-cannot-read-property-x-of-null-in-nodejs
userSchema.methods.addToCart = function (cart) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
      });
      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];
    
      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: product._id,
          quantity: newQuantity,
        });
      }
      const updatedCart = {
        items: updatedCartItems,
      };
      this.cart = updatedCart;
      return this.save();
    };
    
    userSchema.methods.removeFromCart = function (productId) {
      const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId !== productId;
      });
      this.cart.items = updatedCartItems;
      return this.save();
    };*/

module.exports = mongoose.model("Users", UserSchema);