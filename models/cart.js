module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {}; // 'items' es un objeto {}, NO un simple arr.
  this.totalNumberOfItems = oldCart.totalNumberOfItems || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = (item) => {
      const id = item.id;
      const storedItem = this.items[id];
      if (!storedItem) {
          // Es la primera vez que se añade este artículo a la cesta.
          storedItem = this.items[id] = { item: item, quantity: 1, price: 0 };
          storedItem.price = item.price * storedItem.quantity;
          this.totalNumberOfItems++;
          this.totalPrice += storedItem.price;
      }else {
          // Agrupar elementos.
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

      // Importante para que el usuario no pueda seguir quitando 1 unidad de un artículo del carrito...
      if (this.items[itemId].quantity <= 0) {
          // Elimina el artículo del carrito obj.
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
Ejemplo de estructura JSON del carro para su referencia:
*/