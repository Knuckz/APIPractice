const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        console.log(errors);
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password
    bcrypt.hash(password, 12).then(hashedPw => {
        db.query(user.addUser.text, [email, hashedPw, name], (err, result) => {
            if (!!err) {
                next(err);
            }
            if (!!result) {
                res.status(201).json({
                    message: "user entered into table"
                })
            }
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    //find out if user exists
    db.query(user.checkEmail.text, [email], (err, result) => {
        if (!!err) {
            const error = new Error('could not be found');
            error.statusCode = 401;
            throw error;
        }
        if (!!result) {
            loadedUser = result.rows[0];
            if (!bcrypt.compare(password, result.rows[0].password)) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()}, 
                'secret', 
                {
                    expiresIn: '1h'
                });
            res.status(201).json({
                token: token,
                userId: loadedUser._id.toString(),
                message: `Login success!`
            })
        }
    });
}