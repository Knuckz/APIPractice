const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const user = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.put(
    '/signup', 
    [
        body('email')
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value) => {
            //look for if email exists
            db.query(user.checkEmail.text, [value], (err, result) => {
                if (!!result.rows.length > 0) {
                    throw new Error('email is used!');
                }
            });
            return true;
        })
        .normalizeEmail(),
        body('password').trim().isLength({min: 5}),
        body('name').trim().not().isEmpty()
    ], 
    authController.signup
);

router.post('/login', authController.login);

module.exports = router;