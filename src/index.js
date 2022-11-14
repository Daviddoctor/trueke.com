const createError = require('http-errors');
const express = require('express');
const Handlebars = require('handlebars')                       /* Agregadas*/
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')/* Agregadas*/
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const indexRouter = require('./routes/index');
const userRoute = require("./routes/users");
const ConnectMongo = require("connect-mongo")/*(expressSession)*/; // Using 'connect-mongo' for
const MongoStore = require('connect-mongo').default;
const mongoose = require('mongoose');



//Initiliazations: Inicializaciones
const app = express();
require('./database');
require("./config/passport");

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
                                    

//Middlewares: Todas las funciones ejecutadas que van al servidor
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'truekesecret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 180 * 60 * 1000 } // How long sessions should last until they expire (in ms).
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Creating my own middleware to add special vars to the template engines depending
// on whether or not the user is logged in.
app.use((req, res, next) => {
    // Adding a 'login' var (like a context).
    res.locals.login = req.isAuthenticated()
    res.locals.session = req.session;
    next();
});

 
// Global Variables: Datos globales para toda la app
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes: URLS DE RUTAS
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files: Carpeta de archivos estaticos

app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning: Inciar el servidor
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

// Dealing with the favicon.ico. (ERRORES)
app.get("/favicon.ico", (req, res, next) => {
    return res.sendStatus(204); // Empty response.
});

app.use('/', indexRouter);
app.use("/users", userRoute);

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
