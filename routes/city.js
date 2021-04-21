/*jshint esversion: 9 */
/*jshint node: true */
'use strict';

const express = require('express');
const CityController = require('../controllers/city');
const md_auth = require('../middlewares/authenticated');

let api = express.Router();

api.get('/test-weather/:id',md_auth.ensureAuth, CityController.getWeather);
api.post('/city',           md_auth.ensureAuth, CityController.saveCity);
api.get('/city',            md_auth.ensureAuth, CityController.getAllCity);
api.get('/city/:id',        md_auth.ensureAuth, CityController.getCity);
api.delete('/city/:id',     md_auth.ensureAuth, CityController.deleteCity);
api.put('/city/:id',        md_auth.ensureAuth, CityController.updateCity);
// api.put('/city/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;