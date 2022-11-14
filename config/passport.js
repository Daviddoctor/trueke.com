const passport = require("passport");
const UserModel = require("../models/mongoose/user");
const { check, validationResult } = require("express-validator");
const LocalStrategy = require ("passport-local").Strategy;

// Tells passport how to store the user in a session.
passport.serializeUser((user, done) => {
    console.log("The serializeUser function has been called.");
    console.log(user);
    done(null, user.id); // Saving the id of the user in the session.
});

// Basically get the id stored in a session and fetch user with it.
passport.deserializeUser(async (id, done) => {
    console.log("The deserializeUser function has been called.");
    UserModel.findById(id, (error, user) => {
        done(error, user);
    })
});

// Sign up configuration.
passport.use("local.signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {

    // So, that's here that I'm going to use the express-validator lib.
    //
    // As I have the 'request' object here, I have access to the data the user
    // sent through the request. I can use this data to check for example if
    // the typed email is in its right form, and ONLY THEN, pass it forward
    // to validate the typed data against what's already in the db.

    // If any of the errors above exist. Let's handle them.
    // var errors = request.validationErrors();
    const errors = validationResult(req)["errors"];
    // console.log(errors);
    // console.log(typeof errors); // JSON Object.
    if (errors && errors.length){
        const messages = [];
        errors.forEach((error) => {
            messages.push(error["msg"]);
        });
        // third param: now instead of extracting the flash message, I am
        // assigning 'messages' to the error var. I'll get the 'error' var in
        // the route's index.js file.
        return done(null, false, req.flash("error", messages));
    }

    UserModel.findOne({"email": email}, (error, user) => {
        if (error){
            // 'done' should be invoked with an error in case an exception (such
            // as with the db) occurred.
            // What if there is an error like this? How am I going to show
            // that to the user? How is it going to be displayed to the user.
            return done(error);
        }
        if (user) {
            // A user already exists with this email.
            // 'null' means no error (but we do have one here, a special one)
            // 'false' means authentication failure.
            return done(null, false, { message: "Email is already in use." });
        }
        // Then create a new user (no error, no user).
        const newUser = new UserModel();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((error, result) => {
            if (error) {
                return done(error);
            }
            return done(null, newUser);
        });
    })
}));

passport.use("local.signin", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {

    console.log("Error 1");
    // If any of the errors above exist. Let's handle them.
    const errors = validationResult(req)["errors"];
    if (errors && errors.length){
        const messages = [];
        errors.forEach((error) => {
            messages.push(error["msg"]);
        });
        return done(null, false, req.flash("error", messages));
    }

    UserModel.findOne({"email": email}, (error, user) => {
        if (error) {
            console.log("Error 2");
            return done(error);
        }

        if (!user) {
            return done(null, false, { message: "This user does not exist." });
        }

        if (!user.isValidPassword(password)) {
            return done(null, false, { message: "Wrong password." })
        }
        return done(null, user);
    });
}));

/* -- PRIMERA VERSION --
const User = require ("../models/Users");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy ({
    usernameField: "email"
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
        return done(null, false, { message: "Usuario no encontrado."});
    } else {
        const match = await user.matchPassword(password);
        if(match) {
            return done(null, user);
        } else {
            return done(null, false, {message: "Contraseña Incorrecta."});
        }
    }
}));*/
