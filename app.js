/*jshint esversion: 9 */
/*jshint node: true */
'use strict';
const express = require('express');
// const bodyParser = require('body-parser');

let app = express();

// Routes
const user_routes = require('./routes/user');
const city_routes = require('./routes/city');

// app.use(bodyParser.urlencoded({extende:false}));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Headers HTTP

// Base Routes
app.use('/api', user_routes);
app.use('/api', city_routes);

module.exports = app;