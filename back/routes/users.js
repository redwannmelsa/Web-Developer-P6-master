//imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');

router.post('/signup', userCtrl.signup); //routes /api/auth/signup to signup controller
router.post('/login', userCtrl.login); //routes /api/auth/login to login controller

module.exports = router;