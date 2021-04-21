/*jshint esversion: 9 */
/*jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = Schema({
    name: String,
    country: String,
    code: String,
    internationaleCode: String,
    temperature: String,
    maxTemperature: String,
    minTemperature: String,
    feelsLike: String,
    humidity: String
});

module.exports = mongoose.model('City', CitySchema);
