const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");
const tokenMiddleware = require("../../middlewares/token");
const User = require("../models/userModel");

/**
 * Creates a new user object in the DB
 * POST:
 * {
 *  "firstName": "null", (firstName is optional)
 *  "lastName": "null", (lastName is optional)
 *  "email": "test@test.com",
 *  "password": "test"
 *  "createdOnDate": "string that clearly shows when a user is created"
 * }
 */
exports.create_new_user = (req, res) => {
  const firstName = req.body.firstName ? req.body.firstName : "";
  const lastName = req.body.lastName ? req.body.lastName : "";
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  let newUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    createdOnDate: format(new Date(), "dd/MM/yyyy"),
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: "Error creating new user",
        data: err,
      });
    }
    res.status(201).json({
      success: true,
      message: "User created",
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
        message: "An error occurred",
        data: err,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login failed",
        data: {
          message: "Invalid login credentials",
        },
      });
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Login failed",
        data: {
          message: "Invalid login credentials",
        },
      });
    }
    let token = jwt.sign({ username: user._id }, process.env.JWT_SECRET, {
      // TODO: SET JWT TOKEN DURATION HERE
      expiresIn: "24h",
    });
    let userFiltered = _.pick(user.toObject(), ["name", "email", "_id"]);
    userFiltered.token = token;
    res.cookie("token", token, { expiresIn: "24h" });
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: userFiltered,
    });
  });
};

/**
 * Can be used to check if a given token is valid
 * GET:
 * PARAM: token
 */
exports.check_token_valid = async (req, res) => {
  const token = req.params.token;
  if (!token || token === null) {
    res.status(400).json({
      success: false,
      message: "Incorrect Request Parameters",
      data: null,
    });
  }
  let tokenValid;
  await tokenMiddleware
    .checkToken(token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        tokenValid = true;
      }
    })
    .catch((promiseError) => {
      if (promiseError) {
        return res.status(500).json({
          success: false,
          message: "Bad Token",
          data: null,
        });
      }
    });
  if (tokenValid) {
    res.status(200).json({
      success: true,
      message: "Token Valid",
      data: null,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Token not valid",
    });
  }
};
