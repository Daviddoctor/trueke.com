const ProductModel = require("../models/mongoose/product");

function getAll() {
    return ProductModel.find({});
}

function getProductById(productId){
    return ProductModel.findById(productId, (error, obj) => {
        if (error) {
            throw error;
        }
    });
}

module.exports = {
    getAll, getProductById
}