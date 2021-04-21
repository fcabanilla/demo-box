/*jshint esversion: 9 */
/*jshint node: true */
'use strict';

const mongoose = require('mongoose');
const weather = require('openweather-apis');
weather.setLang('es');
weather.setUnits('metric');
weather.setAPPID('0f564730fd10804945ef001ad493cd27');
weather.setCity("Cordoba, Cordoba, Argentina");



const app = require('./app');
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo:27017/demo-box', { useNewUrlParser: true, useUnifiedTopology: true}, (err, res)=> {
    if (err) {
        throw err;
    } else {
        console.log(`La base de datos esta corriendo correctamente...`);

        app.listen(port, function(){
            console.log(`Servidor de la API REST Demo Box Custodia escuchando en http://localhost:${port}`);
        });
    }
});