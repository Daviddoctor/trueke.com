/* const csrf = require("csurf");*/
const express = require("express");
const passport = require("passport");
const { check } = require("express-validator");
const orderService = require("../services/OrderService.js");
const Cart = require("../models/cart");

const User = require("../models/Users");

const { isAuthenticated } = require("../helpers/auth");
const router= express.Router();
/* router.use(csrf());*/

router.get("/users/profile", isAuthenticated, async (req, res, next) => {
    try {
        orders = await orderService.getOrdersByUser({ user: req.user });
        res.render("user/profile", { orders });

    }catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
});

/* Esta función fue corregida para poder hacer Logout*/
router.get('/users/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
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

//SIGNIN
router.get("/users/signin", (req, res, next) =>{
    const messages = request.flash("error");
    return res.render("users/signin", { csrfToken: request.csrfToken(), messages });
});

router.post("/users/signin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/signin",
    failureFlash: true
}));


//SIGNUP
router.get("/users/signup", (req, res) =>{
    res.render("users/signup");
});

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
            res.redirect("/users/signup");
        }
       const newUser = new User({name, surname, email, password});
       newUser.password = await newUser.encryptPassword(password);
       await newUser.save();
       req.flash("success_msg", "Usuario Registrado");
       res.redirect("/users/signin");
    }

});


module.exports = router; 

function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}