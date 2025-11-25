const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });

// Post /auth/signup
router.post('/signup', auth, authController.signUp);

//Post /auth/login
router.post('/login', authController.logIn);

module.exports = router;