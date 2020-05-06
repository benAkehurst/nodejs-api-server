'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

/**
 * Creates a new user object in the DB
 * POST:
 * {
 *  "name": "null", (name is optional)
 *  "email": "test@test.com",
 *  "password": "test"
 * }
 */
exports.create_new_user = (req, res) => {
  const name = req.body.name ? req.body.name : '';
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  let newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Error creating new user',
        data: err,
      });
    }
    res.status(201).json({
      success: true,
      message: 'User created',
      data: null,
    });
  });
};

/**
 * Logs a user in
 * POST:
 * {
 *  "email": "test@test.com",
 *  "password": "test"
 * }
 */
exports.login_user = (req, res) => {
  let data = req.body;
  User.findOne({ email: data.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred',
        data: err,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login failed',
        data: {
          message: 'Invalid login credentials',
        },
      });
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Login failed',
        data: {
          message: 'Invalid login credentials',
        },
      });
    }
    let token = jwt.sign({ username: user._id }, process.env.JWT_SECRET, {
      // TODO: SET JWT TOKEN DURATION HERE
      expiresIn: '24h',
    });
    let userFiltered = _.pick(user.toObject(), ['name', 'email', '_id']);
    userFiltered.token = token;
    res.cookie('token', token, { expiresIn: '24h' });
    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: userFiltered,
    });
  });
};
