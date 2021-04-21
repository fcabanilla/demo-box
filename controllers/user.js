/*jshint esversion: 9 */
/*jshint node: true */
'use strict';
const bcrypt = require('bcrypt');
const User = require('../models/user');
const HTTP = require('http-status-codes');
const jwt = require('../services/jwt');

const status = HTTP.StatusCodes;
const saltRounds = 10;


function test(req, res) {
    res.status(200).send({
        message: `Probando una accion del controlador de usuarios de la API REST Demo Box Custodia`
    });
}

function getAllUser(req, res) {
    User.find((err, users) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error al listar los usuarios` });
        } else {
            return res.status(status.OK).send({ users: users});
        }
    });
}

function getUser(req, res) {
    const userID = req.params.id;

    User.findById(userID, (err, user) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error en la peticion` });
        } else {
            if (!user) {
                res.status(status.NOT_FOUND).send({ message: `El usuario no existe` });
            } else {
                res.status(status.OK).send({ user: user });
            }
        }
    });
}

function saveUser(req, res) {

    let user = new User();
    const { name, surname, email, password, city, ...rest } = req.body;

    // console.log(user);
    // ({ user } = { name, surname, email})
    // {user} = name, surname, email;
    
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.role = 'ROLE_USER';
        user.image = null;
        user.city = city;
    
    console.log(user);
    if (password) {
        // Encript pass and storege data

        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                console.log(`Hash : ${hash}`);
                user.password = hash;

                if (user.name != null && user.surname != null && user.email != null) {
                    user.save((err, userStored) => {
                        if (err) {
                            res.status(status.INTERNAL_SERVER_ERROR);
                        } else {
                            if (!userStored) {
                                res.status(status.NOT_FOUND)
                                    .send({
                                        error: HTTP.getReasonPhrase(status.NOT_FOUND)
                                    });
                            } else {
                                res.status(status.CREATED)
                                    .send({ user: userStored });
                            }
                        }
                    });
                }
            });
        });

    } else {
        res
            .status(status.BAD_REQUEST)
            .send({
                error: HTTP.getReasonPhrase(status.BAD_REQUEST)
            });
    }


}

function loginUser(req, res) {
    const { email, password, getToken} = req.body;

    console.log(req.body);

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Error en la petición' });
        } else {
            if (!user) {
                res.status(status.NOT_FOUND).send({ message: 'El usuario no existe' });
            } else {
                console.log(user.password);

                // Comprobar la contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    console.log({check});
                    if (check) {
                        //devolver los datos del usuario logueado
                        if (getToken) {
                            // devolver un token de jwt
                            res.status(status.OK).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(status.OK).send({ user });
                        }
                    } else {
                        res.status(status.NOT_FOUND).send({ message: 'El usuario no ha podido loguease' });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    if (userId != req.user.sub) {
        return res.status(status.INTERNAL_SERVER_ERROR)
        .send({ message: 'No tienes permiso para actualizar este usuario'});
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdated) {
                res.status(status.NOT_FOUND).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}
module.exports = {
    test,
    saveUser,
    loginUser,
    updateUser,
    getUser,
    getAllUser
};