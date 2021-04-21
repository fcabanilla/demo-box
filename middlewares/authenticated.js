/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'v7%BhMk4m$V%VJj7!p448NSu&Yj!A';
const HTTP = require('http-status-codes');

const status = HTTP.StatusCodes;

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(status.FORBIDDEN).send({ message: 'La petición no tiene la cabecera de autenticación' });
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');
    let payload;
    try {
        payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(status.UNAUTHORIZED).send({ message: 'El token ha expirado' });
        }
    } catch (ex) {
        //console.log(ex);
        return res.status(status.NOT_FOUND).send({ message: 'Token no válido' });
    }

    req.user = payload;

    next();
};