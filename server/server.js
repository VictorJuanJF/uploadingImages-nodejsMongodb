const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('./config/config.js');

//Configuracion global de rutas
app.use(require(__dirname + './routes/index.js'));




mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw new err;
    console.log('MongoDB Online');

});


app.listen(process.env.PORT, () => {
    console.log(`Listening port ${process.env.PORT}`);
});