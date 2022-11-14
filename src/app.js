const createError = require('http-errors');
const express = require('express');
const Handlebars = require('handlebars')                       /* Agregadas*/
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')/* Agregadas*/
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const indexRouter = require('./routes/index');
const passport = require("passport");
const connectFlash = require("connect-flash");
const userRoute = require("./routes/users");
const ConnectMongo = require("connect-mongo"); // Using 'connect-mongo' for
// session storage so that I can store session data on the mongo db, intead of my
// local pc memory.
// const expressValidator = require("express-validator");
require("./config/passport"); // To run the passport configuration.

//Initiliazations: Inicializaciones
const app = express();

//Settings: Configuración
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
handlebars: allowInsecurePrototypeAccess(Handlebars),  /* Agregada*/
defaultLayout: 'main',
layoutsDir: path.join(app.get('views'), 'layouts'),
partialsDir: path.join(app.get('views'), 'partials'),
extname: '.hbs'
}));
app.set('view engine', '.hbs');

// view engine setup
/*app.engine("hbs", exphbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}));
app.set("view engine", "hbs");*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressSession({
    secret: 'truekesecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 180 * 60 * 1000 } // How long sessions should last until they expire (in ms).
}))
app.use(passport.initialize()); // I'll only be using the local strategy (there are others
// like using facebook, google, etc...)
app.use(passport.session()); // To store logged in/out users also needs the sessions lib above.
// app.use(expressValidator());
app.use(connectFlash()); // Uses sessions and needs the sessions lib above to be initialized first.

// Creating my own middleware to add special vars to the template engines depending
// on whether or not the user is logged in.
app.use((request, response, next) => {
    // Adding a 'login' var (like a context).
    response.locals.login = request.isAuthenticated()
    response.locals.session = request.session;
    next();
});

// Dealing with the favicon.ico.
app.get("/favicon.ico", (request, response, next) => {
    return response.sendStatus(204); // Empty response.
});

app.use('/', indexRouter);
app.use("/user", userRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;