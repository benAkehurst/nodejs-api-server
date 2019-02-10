'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

exports.get_all_users = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.send({
        error: err,
        message: 'No users fround',
        code: 204
      });
    }
    res.send({
      message: 'All users returned',
      data: users,
      code: 200
    });
  });
};

exports.create_a_user = (req, res) => {
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  });
  newUser.save((err, user) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t create new user',
        code: 400
      });
    }
    res.send({
      message: 'User created',
      data: user,
      code: 201
    });
  });
};

exports.get_single_user = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t find user',
        code: 400
      });
    }
    res.send({
      message: 'User found',
      data: user,
      code: 200
    });
  });
};

exports.update_a_user = (req, res) => {
  User.findByIdAndUpdate({
      _id: req.params.userId
    },
    req.body, {
      new: true
    },
    (err, user) => {
      if (err) {
        res.send({
          error: err,
          message: 'Couldn\'t update user',
          code: 400
        });
      };
      res.send({
        message: 'User updated successfully',
        data: user,
        code: 200
      });
    });
};

exports.delete_a_user = (req, res) => {
  User.remove({
      _id: req.params.userId
    },
    (err, user) => {
      if (err) {
        res.send({
          error: err,
          message: 'Couldn\'t delete user',
          code: 400
        });
      }
      res.send({
        message: 'User deleted successfully',
        data: user,
        code: 200
      });
    });
}
