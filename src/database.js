/*const app = require('./app');*/
const debug = require('debug')('cart-proj:server');
const http = require('http');
const mongoose = require('mongoose');
/* const config = require("../config/index");*/

/* Connecting to mongodb using mongoose.*/
/* mongoose.connect(config.mongodb.dsn, { useNewUrlParser: true })
 .then(() => {
     console.log("Successfully connected to MongoDB through Mongoose.");
 })
 .catch((error) => {
     console.log("Error when connecting to MongoDB through Mongoose: " + error);
 });*/

/** Get port from environment and store in Express.*/

/* const port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);*/
 
/* Create HTTP server.*/

 /* const server = http.createServer(app);*/

/* Listen on provided port, on all network interfaces.*/

 /* server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);*/
 
/* Normalize a port into a number, string, or false. */

 /*function normalizePort(val) {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

/* Event listener for HTTP server "error" event.*/

 /*function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /* Event listener for HTTP server "listening" event.*/

/*function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }*/

/* SPRINT1 */
mongoose.connect('mongodb://0.0.0.0:27017/trueke-db-app', {
    useNewUrlParser: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err, 'Error DB conection'));