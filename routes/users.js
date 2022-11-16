const csrf = require("csurf");
const express = require("express");
const passport = require("passport");
const { check } = require("express-validator");
const orderService = require("../services/OrderService.js");
const Cart = require("../models/cart");
const User = require("../models/Users");

const { isAuthenticated } = require("../helpers/auth");

const router= express.Router();
router.use(csrf());

router.get("/users/profile", isAuthenticated, async (req, res, next) => {
    try {
        orders = await orderService.getOrdersByUser({user: req.user });
        res.render("users/profile", {orders});

    }catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
});

/* Esta función fue corregida para poder hacer Logout*/
router.get('/users/logout', isAuthenticated, (req, res, next) => {
    req.logout(function (error) {
      if (error) {
        return next(error);
      }
      // if you're using express-flash
      req.flash('success_msg', 'Sesión Finalizada');
      res.redirect('/');
    });
}); 

// Creating our own middleware: only allow not-logged-in users to access the
// following routes.
router.use("/", isNotAuthenticated, (req, res, next) => {
    next();
})

// Validaciones Signup
router.post("/users/signup", async (req, res) => {
    const {name, surname, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text:"El campo Nombre esta vacio"});
    }
    if(password != confirm_password){
        errors.push({text: "Las contraseñas no coinciden"});
    }
    if (password.length < 4){
        errors.push({text: "La contraseña debe ser mayor a 4 caracteres"})
    }
    if(errors.length > 0){
        res.render("users/signup", {errors, name, surname, email, password, confirm_password});
    }
    else{
       const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash("error_msg", "El email registrado se encuentra en uso");
            res.redirect("users/signup");
        }
       const newUser = new User({name, surname, email, password});
       newUser.password = await newUser.encryptPassword(password);
       await newUser.save();
       req.flash("success_msg", "Usuario Registrado");
       res.redirect("users/signin");
    } 

});

// Otras validaciones

router.get("/users/signup", (req, res, next) => {
    // Extracts any flash messages on the request and store under 'error.'
    // Although in the second error in the passport config file, I wrote
    // {message: ...}, passport stores that flash message in the variable called
    // error.
    const messages = req.flash("error");
    return res.render("users/signup", { csrfToken: req.csrfToken(), messages });
});

router.post("/users/signup", [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 4 }).withMessage("Invalid password")
], passport.authenticate("local.signup", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/signup",
    failureFlash: true // Shows the message I set at passport.js
}), (req, res, next) => {
    // Only gets executed if it doesn't fail.
    if(req.session.oldURL) {
        const oldURL = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldURL);
    }else {
        res.redirect("/users/profile");
    }
});

//SIGNIN
router.get("/users/signin", (req, res, next) =>{
    const messages = req.flash("error");
    return res.render("users/signin", { csrfToken: req.csrfToken(), messages });
});

router.post("/users/signin", [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 4 }).withMessage("Invalid password")
], passport.authenticate("local.signin", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/signin",
    failureFlash: true
})); (req, res, next) => {
    // Only gets executed if it doesn't fail.
    if(req.session.oldURL) {
        const oldURL = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldURL);
    }else {
        res.redirect("/users/profile");
    }
};

module.exports = router; 

function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

/*//SIGNUP -- PRIMERA VERSIÓN --

router.get("/users/signup", (req, res, next) =>{
    const messages = req.flash("error");
    return res.render("users/signup", { csrfToken: request.csrfToken(), messages });
});
*/
