const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const sanitize = require('mongo-sanitize');
const {
  checkEmailExists,
  validateEmail,
} = require('../../middlewares/validators');
const { checkToken } = require('../../middlewares/token');
const { sendEmail } = require('../../middlewares/utils/emailService');
const User = require('../models/userModel');
const Code = require('../models/codeModel');
const Task = require('../models/taskModel');

/**
 * Logs a user in
 * POST:
 * {
 *  "email": "",
 *  "password": "",
 *  "rememberMe": boolean
 * }
 */
exports.login_user = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please fill in all fields!',
      data: null,
    });
  } else {
    try {
      const user = await User.findOne({ email: sanitize(email) });
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'The provided email is not registered.',
          data: err,
        });
      } else {
        const pwCheckSuccess = await bcrypt.compare(password, user.password);
        if (!pwCheckSuccess) {
          res.status(400).json({
            success: false,
            message: 'Email and password do not match.',
            data: err,
          });
        } else {
          let token = jwt.sign(
            { username: user.uniqueId },
            process.env.JWT_SECRET,
            {
              // TODO: SET JWT TOKEN DURATION HERE
              expiresIn: rememberMe ? '48h' : '1h',
            }
          );
          let userFiltered = _.pick(user.toObject(), ['firstName', 'uniqueId']);
          userFiltered.token = token;
          res.cookie('session', token, {
            expiresIn: rememberMe ? '48h' : '1h',
          });
          let tasks = await Task.find({ user: user.uniqueId });
          userFiltered.tasks = tasks;
          res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            data: userFiltered,
          });
        }
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong.',
        data: null,
      });
    }
  }
};

/**
 * Creates a new user object in the DB
 * POST:
 * {
 *  "firstName": "null", (firstName is optional)
 *  "lastName": "null", (lastName is optional)
 *  "email": "test@test.com",
 *  "password": "Abc123!"
 *  "password2": "Abc123!"
 *  "acceptedTerms": true
 *  "createdOnDate": "string that clearly shows when a user is created"
 *  "uniqueId": "string with unique uuid for DB queries without exposing DB ID"
 * }
 */
exports.create_new_user = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    password2,
    acceptedTerms,
  } = req.body;
  const emailCheck = await checkEmailExists(email);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
      data: null,
    });
  } else if (!email || !password || !password2) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
      data: null,
    });
  } else if (password != password2) {
    res.status(400).json({
      success: false,
      message: 'The entered passwords do not match!',
      data: null,
    });
  } else if (
    !password.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
    )
  ) {
    res.status(400).json({
      success: false,
      message:
        'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
      data: null,
    });
  } else if (!acceptedTerms) {
    res.status(400).json({
      success: false,
      message: 'You need to accept the terms of use.',
      data: null,
    });
  } else if (!validateEmail(email)) {
    res.status(400).json({
      success: false,
      message: 'Email address has invalid format',
      data: null,
    });
  } else if (!emailCheck) {
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      data: null,
    });
  } else {
    try {
      const newUser = new User({
        firstName: firstName ? firstName : '',
        lastName: lastName ? lastName : '',
        email: email,
        password: bcrypt.hashSync(req.body.password, 14),
        acceptedTerms: true,
        createdOnDate: format(new Date(), 'dd/MM/yyyy'),
        uniqueId: uuidv4(),
      });
      const user = await newUser.save();
      const token = jwt.sign(
        { username: user.uniqueId },
        process.env.JWT_SECRET,
        {
          // TODO: SET JWT TOKEN DURATION HERE
          expiresIn: '24h',
        }
      );
      const baseUrl = req.protocol + '://' + req.get('host');
      const secretCode = cryptoRandomString({
        length: 6,
      });
      const newCode = new Code({
        code: secretCode,
        email: user.email,
      });
      await newCode.save();
      const data = {
        from: `YOUR NAME <${process.env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: 'Your Activation Link for YOUR APP',
        text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/api/auth/verification/verify-account/${user.uniqueId}/${secretCode}`,
        html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/api/v1/auth/verification/verify-account/${user.uniqueId}/${secretCode}" target="_blank">Email Verification Link</a></strong></p>`,
      };
      await sendEmail(data);
      res.status(201).json({
        success: true,
        message: 'User created',
        data: { uniqueId: user.uniqueId, token: token, tasks: null },
      });
    } catch {
      res.status(400).json({
        success: false,
        message: 'General Error Creating new account',
        data: null,
      });
    }
  }
};

/**
 * External facing route that listens for a user confirming their email.
 * GET
 * PARAMS: uniqueId & SecretCode
 */
exports.validate_user_email_and_account = async (req, res) => {
  try {
    const user = await User.findOne({
      uniqueId: sanitize(req.params.uniqueId),
    });
    const response = await Code.findOne({
      email: user.email,
      code: sanitize(req.params.secretCode),
    });

    if (!user) {
      res.sendStatus(401);
    } else {
      await User.updateOne(
        { email: user.email },
        { $set: { userStatus: 'active', userActive: true } }
      );
      await Code.deleteMany({ email: user.email });

      let redirectPath;

      if (process.env.NODE_ENV == 'production') {
        redirectPath = `${req.protocol}://${req.get('host')}account/verified`;
      } else {
        redirectPath = `http://127.0.0.1:8080/account/verified`;
      }

      res.redirect(redirectPath);
    }
  } catch (err) {
    console.log('Error on /api/auth/verification/verify-account: ', err);
    res.sendStatus(500);
  }
};

/**
 * Sends a code to the user to allow them to reset their passowrd
 * POST
 * PARAMS:
 * {
 *   "email": ""
 * }
 */
exports.get_reset_password_code = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      success: false,
      message: 'Please provide your registered email address!',
      data: null,
    });
  } else {
    try {
      const user = await User.findOne({ email: sanitize(email) });

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'The provided email address is not registered!',
          data: null,
        });
      } else {
        const secretCode = cryptoRandomString({
          length: 6,
        });
        const newCode = new Code({
          code: secretCode,
          email: email,
        });
        await newCode.save();
        const data = {
          from: `YOUR NAME <${process.env.EMAIL_USERNAME}>`,
          to: email,
          subject: 'Your Password Reset Code for YOUR APP',
          text: `Please use the following code within the next 10 minutes to reset your password on YOUR APP: ${secretCode}`,
          html: `<p>Please use the following code within the next 10 minutes to reset your password on YOUR APP: <strong>${secretCode}</strong></p>`,
        };
        await sendEmail(data);
        res.status(201).json({
          success: true,
          message: 'Code send successfully',
          data: null,
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Something went wrong getting a code to reset email',
        data: null,
      });
    }
  }
};

/**
 * Allows the user to reset their password by providing 2x new password and their code
 * POST
 * PARAMS:
 * {
 * "email": "",
 * "password": "",
 * "password2": "",
 * "code": ""
 * }
 */
exports.verify_new_user_password = async (req, res) => {
  const { email, password, password2, code } = req.body;
  if (!email || !password || !password2 || !code) {
    res.status(400).json({
      success: false,
      message: 'Please fill in all fields!',
      data: null,
    });
  } else if (password !== password2) {
    res.status(400).json({
      success: false,
      message: 'The entered passwords do not match!',
      data: null,
    });
  } else if (
    !password.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
    )
  ) {
    res.status(400).json({
      success: false,
      message:
        'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
      data: null,
    });
  } else {
    try {
      const response = await Code.findOne({ email: email, code: code });
      if (response.length === 0) {
        res.status(400).json({
          success: false,
          message:
            'The entered code is not correct. Please make sure to enter the code in the requested time interval.',
          data: null,
        });
      } else {
        const newHashedPw = await bcrypt.hashSync(password, 10);
        await User.updateOne(
          { email: sanitize(email) },
          { $set: { password: newHashedPw } }
        );
        await Code.deleteOne({ email, code });
        res.status(200).json({
          success: true,
          message: 'Password reset successfully',
          data: null,
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Something went wrong, please try again',
        data: null,
      });
    }
  }
};

/**
 * Allows a user to delete their account
 * POST
 * PARAMS:
 * {
 * "password": "",
 * "uniqueId":""
 * }
 */
exports.delete_user_account = async (req, res) => {
  const { password, uniqueId } = req.body;
  if (!password) {
    res.status(400).json({
      success: false,
      message: 'Please provide your password',
      data: null,
    });
  } else {
    try {
      const user = await User.findOne({ uniqueId: sanitize(uniqueId) });
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Oh, something went wrong. Please try again!',
          data: null,
        });
      } else {
        const pwCheckSuccess = await bcrypt.compare(password, user.password);

        if (!pwCheckSuccess) {
          res.status(400).json({
            success: false,
            message: 'The provided password is not correct.',
            data: null,
          });
        } else {
          const deleted = await User.deleteOne({
            email: user.email,
          });

          if (!deleted) {
            res.status(400).json({
              success: false,
              message: 'Oh, something went wrong. Please try again!',
              data: null,
            });
          } else {
            res.status(200).json({
              success: true,
              message: 'Account deleted successfully',
              data: null,
            });
          }
        }
      }
    } catch (err) {
      console.log('Error on /api/auth/delete-account: ', err);
      res.status(400).json({
        success: false,
        message: 'Oh, something went wrong. Please try again!',
        data: null,
      });
    }
  }
};

/**
 * Can be used to check if a given token is valid
 * GET:
 * PARAM: token
 */
exports.check_token_valid_external = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Parameters',
      data: null,
    });
  }
  try {
    let tokenValid = await checkToken(token);
    if (!tokenValid) {
      res.status(400).json({
        success: false,
        message: 'Token Not Valid',
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Token Valid',
        data: null,
      });
    }
  } catch {
    res.status(500).json({
      success: false,
      message: 'Oh, something went wrong checking token. Please try again!',
      data: null,
    });
  }
};
