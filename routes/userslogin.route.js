const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const _users = db.Users;

router.get('/login', (req, res) => {
    res.render("users/login", { layout: false })
});
router.get('/register', (req, res) => {
    res.render("users/register", { layout: false })
});

router.post('/login', (req, res, next) => { //successRedirect: '/dashboard',
    passport.authenticate('local', {
        successRedirect:'/master/locations',
        failureRedirect: './login',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res) => {

    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Password do not match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be atleast 4 characters' });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            layout: false,
            errors: errors,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,

        });
    } else {
        _users.findOne({
                where: { email: req.body.email }
            })
            .then(user => {
                if (!user) {

                    const newUser = {
                        email: req.body.email,
                        password: req.body.password
                    };
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            _users.create(newUser)
                                .then(user => {
                                    req.flash('success_msg', 'Your are now registed and can login');
                                    res.redirect('/');
                                })
                                .catch(err => {
                                    req.flash('error_msg', err);
                                    return;
                                });
                        });
                    });
                } else {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('./register');
                }
            });
    }
});

// Logout User
router.get('/logout', (req, res) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/dashboard');
});

module.exports = router;