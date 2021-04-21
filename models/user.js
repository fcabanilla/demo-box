/*jshint esversion: 9 */
/*jshint node: true */
'use stict';

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    city: { type: Schema.ObjectId, ref: 'City' },
    image: String
});

module.exports = mongoose.model('User', UserSchema);