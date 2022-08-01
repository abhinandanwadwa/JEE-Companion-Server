const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageURI: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
}, {timestamps: true});

module.exports = mongoose.model('user', UserSchema)