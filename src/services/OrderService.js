const OrderModel = require("../models/mongoose/order");

function createOrder(query) {
    const order = new OrderModel(query);
    order.save((error, result) => {
        if (error) { throw error; }
    });
}

function getOrdersByUser(query) {
    OrderModel.find(query, (error, orders) => {
        if (error) { throw error; }
        var cart;
        orders.forEach((order) => {
            cart = new Cart(order.cart);
            order.items = cart.objectToArray(); // Adding '.items' on the fly...
        });
        return orders;
    });
}

module.exports = {
    getOrdersByUser, createOrder
}