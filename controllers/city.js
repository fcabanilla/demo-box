/*jshint esversion: 9 */
/*jshint node: true */
'use strict';

const path = require('path');
const fs = require('fs');
const HTTP = require('http-status-codes');
const mongoosePaginate = require('mongoose-pagination');
const weather = require('openweather-apis');
const Request = require("request");
const jwt = require('jwt-simple');

const secret = 'v7%BhMk4m$V%VJj7!p448NSu&Yj!A';
const status = HTTP.StatusCodes;
const City = require('../models/city');
const { request } = require('../app');
const User = require('../models/user');
const baseURI = `api.openweathermap.org/data/2.5/`;
const apiID = `0f564730fd10804945ef001ad493cd27`;
const unit = `metric`;
const lang = `es`;

function getWeather(req, res) {
    const cityID = req.params.id;
    City.findById(cityID, (err, city) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error en la peticion` });
        } else {
            if (!city) {
                res.status(status.NOT_FOUND).send({ message: `La ciudad no existe` });
            } else {
                console.log(city);
                calculateWeather(city);
                res.status(status.OK).send({ city: city });
            }
        }
    });
}

function getCity(req, res) {
    // res.status(status.OK).send({message: `Metodo getCity`});
    const cityID = req.params.id;

    City.findById(cityID, (err, city)=>{
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error en la peticion` });
        } else {
            if (!city) {
                res.status(status.NOT_FOUND).send({ message: `La ciudad no existe` });

            } else {
                res.status(status.OK).send({ city: city });

            }
        }
    });
}

function saveCity(req, res) {
    let city = new City();
    let user = new User();
    let { name, code, internationaleCode, temperature, maxTemperature, minTemperature } = req.body;
    let token = req.headers.authorization.replace(/['"]+/g, '');

    city.name = name;
    city.code = code;
    city.internationaleCode = internationaleCode;
    city.temperature = temperature;
    city.maxTemperature = maxTemperature;
    city.minTemperature = minTemperature;
    user.city = city;

    let payload = jwt.decode(token, secret);
    let userID = payload.sub;
    console.log(userID);
    
    User.findByIdAndUpdate(userID, user, (err, userUpdated) =>{
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error al guardar la ciudad` });
        } else {
            if (!userUpdated) {
                res.status(status.NOT_FOUND).send({ message: `La ciudad no se guardo` });

            } else {
                res.status(status.OK).send({ city: userUpdated });

            }
        }
    });
/*
    city.save((err, cityStored) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({message: `Error al guardar la ciudad`});
        } else {
            if (!cityStored) {
                res.status(status.NOT_FOUND).send({message: `La ciudad no se guardo`});
                
            } else {
                res.status(status.OK).send({city: cityStored});
                
            }
        }
    });
    */
}

function getAllCity(req, res) {
    let page;
    
    if (req.query.page) {
        page = req.query.page;
    } else {
        page = 1;
    }
    const itemsPerPage = 4;
    City.find().sort('name').paginate(page, itemsPerPage, (err, cities, total) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error al listar las ciudades` });
        } else {
            return res.status(status.OK).send({
                total_items: total,
                cities: cities
            });
        }
    });
}

function updateCity(req, res) {
    const cityID = req.params.id;
    let update = req.body;

    City.findByIdAndUpdate(cityID, update, (err, cityUpdated) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send({ message: `Error al actualizar la ciudad` });
        } else {
            if (!cityUpdated) {
                res.status(status.NOT_FOUND).send({ message: `La ciudad no existe` });
            } else {
                res.status(status.OK).send({ city: cityUpdated });
            }
        }
    });
}

function deleteCity(req, res) {
    var cityId = req.params.id;

    City.findByIdAndRemove(cityId, (err, cityRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!cityRemoved) {
                res.status(404).send({ message: 'No se ha borrado la ciudad' });
            } else {
                res.status(200).send({ city: cityRemoved });
            }
        }
    });
}

function calculateWeather(city) {
    weather.setLang('es');
    weather.setCity(city.name);
    const url = `http://${baseURI}weather?q=${city.name},${city.country}&appid=${apiID}&units=${unit}&lang=${lang}`;    
    console.log(url);
    Request(url, (err, res, body) => {
        if (err) {
            console.log(err);
            return {message: err};
        } else {
            const info = JSON.parse(body);
            city.temperature = info.main.temp;
            city.maxTemperature = info.main.temp_max;
            city.minTemperature = info.main.temp_min;
            city.feelsLike = info.main.feels_like;
            city.humidity = info.main.humidity;

            console.log(city);
            City.findByIdAndUpdate(city.id, city, (err, cityUpdated) => {
                if (err) {
                    return {message: `No se pudo actualizar la meteorologia`};
                } else {
                    if (!cityUpdated) {
                        return { message: `No se encontro la ciudad` };
                    } else {
                        return { message: `OK` };
                    }
                }
            });
        }
    });
}

module.exports = {
    getCity,
    saveCity,
    getAllCity,
    updateCity,
    deleteCity,
    getWeather
};