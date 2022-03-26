const mongoose = require('mongoose');
const settings = require('../config/default');
const Joi = require('joi');

//Create the schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength:50,
        unique: true
    },
    //Passwords are stored in encrypted form
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength:1024
    },
    role: {
        type: String,
        enum: settings.roles,
        default: "Normal",
        trim: true
    },
    //Operating unit
    ou: {
        type: String,
        enum: settings.ous,
        required: true,
        trim: true
    },
    division: {
        type: String,
        enum: settings.divisions,
        required: true,
        trim: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

//Compile schema to model
const User = mongoose.model('User', userSchema);
exports.User = User;

//Frontend validation
function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(3).max(50).required(),
      ou: Joi.string().min(3).max(50).required(),
      division: Joi.string().min(2).max(50).required(),
    });
    return schema.validate(user);
}

exports.validate = validateUser;