// Run this file with: node file_name.js
const ProductModel = require("../models/mongoose/product");
const mongoose = require("mongoose");
const config = require("../config/index");

data = {
        imagePath: "image/https://images-na.ssl-images-amazon.com/images/I/51nV8Maj4tL._AC._SR240,240.jpg",
        title: "Darth Vader Glove",
        description: "Kadasid asdasbdb agdyasd",
        price: 10
    }

const products = [
    new ProductModel({
        imagePath: "image/path.jpg",
        title: "Darth Vader Glove",
        description: "Kadasid asdasbdb agdyasd",
        price: 10
    }),
    new ProductModel({
        imagePath: "image/path.jpg",
        title: "Luke Skywalker's Lightsaber",
        description: "Kadasid asdasbdb agdyasd",
        price: 20
    }),
    new ProductModel({
        imagePath: "image/path.jpg",
        title: "Yoda's Coat",
        description: "Kadasid asdasbdb agdyasd",
        price: 5
    }),
    new ProductModel({
        imagePath: "image/path.jpg",
        title: "Princess Leia's White Dress",
        description: "Kadasid asdasbdb agdyasd",
        price: 12
    }),
];

/*// Connecting to mongodb using mongoose.
mongoose.connect(config.mongodb.dsn, { useNewUrlParser: true })
    .then(() => {
        console.log("Successfully connected to MongoDB through Mongoose.");
    })
    .catch((error) => {
        console.log("Error when connecting to MongoDB through Mongoose: " + error);
    });*/

// Saving product instances to the product document in mongodb
const done = 0;
for (const i = 0; i < products.length; i++) {
    products[i].save((error, result) => {
        done++;
        if (done == products.length) {
            // Disconnecting...
            console.log("All products have been loaded into mongodb. Disconnecting now...");
            mongoose.disconnect();
        }
    });
}

// Why can't I put the 'disconnect' method after the for loop?
// Because 'save' is async. So, it might be possible that I disconnect from the
// db before I've saved all the prods to it.