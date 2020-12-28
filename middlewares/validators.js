const User = require('../api/models/userModel');

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
const validateEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
  if (password.length <= 6 || password === '') {
    return false;
  }
  return true;
};

const checkEmailExists = (email) => {
  const submittedEmail = email;
  return User.find({ email: submittedEmail }).then((result) => {
    if (result && result.length > 0) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = {
  validateEmail,
  validatePassword,
  checkEmailExists,
};
