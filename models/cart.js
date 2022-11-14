module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {}; // 'items' is an object {}, NOT a simple arr.
  this.totalNumberOfItems = oldCart.totalNumberOfItems || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = (item) => {
      const id = item.id;
      const storedItem = this.items[id];
      if (!storedItem) {
          // First time this item is being added to the cart.
          storedItem = this.items[id] = { item: item, quantity: 1, price: 0 };
          storedItem.price = item.price * storedItem.quantity;
          this.totalNumberOfItems++;
          this.totalPrice += storedItem.price;
      }else {
          // Group items.
          this.totalPrice -= this.items[item.id].price;
          storedItem.quantity++;
          storedItem.price = item.price * storedItem.quantity;
          this.totalNumberOfItems++;
          this.totalPrice += storedItem.price;
      }
  };

  this.reduceByOne = (itemId) => {
      this.items[itemId].quantity--;
      this.items[itemId].price -= this.items[itemId].item.price;
      this.totalNumberOfItems--;
      this.totalPrice -= this.items[itemId].item.price;

      // Important so that the user cannot keep removing 1 unit from an item in the cart...
      if (this.items[itemId].quantity <= 0) {
          // Removes item from the cart obj.
          delete this.items[itemId];
      }
  };

  this.removeAllItemsWithId = (itemId) => {
      this.totalNumberOfItems -= this.items[itemId].quantity;
      this.totalPrice -= this.items[itemId].price;
      delete this.items[itemId];
  }

  this.objectToArray = () => {
      const arr = [];
      for (const key in this.items) {
          arr.push(this.items[key]);
      }
      return arr;
  };
};
/*
Cart JSON structure example for your reference:
*/