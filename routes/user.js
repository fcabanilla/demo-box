/*jshint esversion: 9 */
/*jshint node: true */
'use strict';

const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');

let api = express.Router();

// api.get('/user', UserController.listUser);

api.get('/user-test', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.get('/login', md_auth.ensureAuth, UserController.getAllUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);

module.exports = api;