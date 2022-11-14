const mongoose = require('mongoose');

/* Conection BD */
mongoose.connect('mongodb://0.0.0.0:27017/trueke-db-app', {
    useNewUrlParser: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err, 'Error DB conection'));