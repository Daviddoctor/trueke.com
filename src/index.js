const express = require('express');
const Handlebars = require('handlebars')                       /* Agregadas*/
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')/* Agregadas*/
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');



//Initiliazations: Inicializaciones
const app = express();
require('./database');

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
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'truekesecret',
    resave: true,
    saveUninitialized: true
}));
 

// Global Variables: Datos globales para toda la app

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