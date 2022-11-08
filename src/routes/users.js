const express = require("express");
const router= express.Router();

const User = require("../models/Users");

router.get("/users/signin", (req, res) =>{
    res.render("users/signin");
});

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