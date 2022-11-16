const csrf = require("csurf");
const express = require('express');
const productService = require("../services/ProductService");
const orderService = require("../services/OrderService.js");
const Cart = require("../models/cart");

const { isAuthenticated } = require("../helpers/auth");

const router = express.Router();
router.use(csrf());

router.get('/', async (req, res, next) => {
    console.log(req.user);
    const successMessage = req.flash("success")[10];
    const products = await productService.getAll();
    return res.render('shop/index', { title: 'Express', products, successMessage,
                                                  noMessages: !successMessage });
});

router.get("/add-to-cart/:id", async (req, res, next) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    try {
        const product = await productService.getProductById(productId);
        cart.add(product);
        req.session.cart = cart;
        console.log("---- SESSION UPDATED ----");
        console.log(req.session.cart);
        console.log("-------------------------");
        res.redirect("/");
    }catch(error) {
        // -- it would be helpful to put a flash message here to tell the user
        // that some error occurred. --
        console.log("-------------------------");
        console.log("Session error: " + error);
        console.log("-------------------------");
        res.redirect("/");
    }
});

router.get("/reduce/:id", async (req, res, next) => {
    try {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.reduceByOne(productId);
        req.session.cart = cart;
        return res.redirect("/shopping-cart");
    }catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
});

router.get("/remove/:id", async (req, res, next) => {
    try {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.removeAllItemsWithId(productId);
        req.session.cart = cart;
        return res.redirect("/shopping-cart");
    }catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
});

router.get("/shopping-cart", (req, res, next) => {
    if (!req.session.cart) {
        console.log("The user does not have a shopping cart yet...")
        return res.render("/shop/cart", { products: null });
    }
    console.log("The user already has a shopping cart. Retrieving it...");
    const cart = new Cart(req.session.cart); // I think I don't need to create
    // another cart here...
    return res.render("/shop/cart", { products: cart.objectToArray(), totalPrice: cart.totalPrice });
});

/* CHECKOUT */
router.get("/shop/checkout", isAuthenticated, (req, res, next) => {
    if (!req.session.cart) {
        res.redirect("/shopping-cart");
    }
    const cart = new Cart(req.session.cart); // I think I don't need to create
    // another cart here...
    const errorMessage = req.flash("error")[0];
    res.render("shop/checkout", { total: cart.totalPrice,
                                       errorMessage,
                                       noError: !errorMessage,
                                       csrfToken: req.csrfToken() });
});

router.post("/checkout", isAuthenticated, (req, res, next) => {
    if (!req.session.cart) {
        res.redirect("/shopping-cart");
    }

    // Making sure the separate forms (not from Stripe) were also filled.
    console.log(!req.body.name);
    if (!req.body.name || !req.body.address) {
        req.flash("error", "Please, fill all the fields.");
        return res.redirect("/checkout");
    }

    try {
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        const stripe = require("stripe")("MY_SECRET_KEY");

        // Token is created using Checkout or Elements!
        // Get the payment token ID submitted by the form:
        const token = request.body.stripeToken; // Using Express

        // Charging user. (I will create a Stripe service later).
        (async () => {
          const charge = await stripe.charges.create({
            amount: req.session.cart.totalPrice * 100, // In cents.
            currency: "usd",
            description: "Test Charge",
            source: token, // Hidden input data submitted from checkout.hbs
          });

          // Adding order obj to mongo db.
          orderService.createOrder({
              // Passport stores the user obj in the request obj.
              user: req.user,
              cart: req.session.cart,
              address: req.body.address, // From form.
              name: req.body.name, // From form.
              paymentId: charge.id
          });

          // Creating a success flash message.
          req.flash("success", "Your order has been successfully placed.");
          req.session.cart = null;
          return res.redirect("/");
        })();
    }catch (error) {
        console.log("Error: " + error);
        req.flash("error", error.message);
        return res.redirect("/checkout");
    }
});

module.exports = router;


/*______________________________________________________________*/

/*router.get("/",(req, res)=>{
    res.render('users/profile');
})

router.get('/index', (req, res) =>{
    res.render('index');
});

router.get('/about', (req, res) =>{
    res.render('about');
});*/
