const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // this plugin allows unique validation - two accounts can't be created with the same email

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// validating the userSchema email to be unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);