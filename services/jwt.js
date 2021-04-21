/*jshint esversion: 9 */
/*jshint node: true */
'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'v7%BhMk4m$V%VJj7!p448NSu&Yj!A';

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};