const bcrypt = require('bcrypt'); //importing bycript to encrypt passwords
const jwt = require('jsonwebtoken'); //importing jwt to generates authentication tokens

const User = require('../models/users'); //importing user model

//signup controller
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //hashing the user inputed password (10 salt) to encrypt it
        .then(hash => {
            const user = new User({ //creates new user with the mongoose model
                email: req.body.email, //email saved on the DB as plain text
                password: hash //password saved on the DB as hash
            });
            user.save() //saves the user to mongodb
                .then(() => res.status(201).json({ message: 'user created' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

//login controller
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //attempts to find an email that matches the email inputed by user
        .then(user => {
            if (!user) { //case if the email does not exist in datebase
                return res.status(401).json({ error: 'User not found'});
            }
            bcrypt.compare(req.body.password, user.password) //if email exists in database, this checks the hashed password in the db with the plain text password inputed by the user
                .then(valid => {
                    if (!valid) { //case if the user password doesn't match the db password
                        return res.status(401).json({ error: 'Wrong password'})
                    }
                    //this runs if the passwords match
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //creating jwt using random_token_secret key
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' } //session lasts 24h before auto disconnect
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};