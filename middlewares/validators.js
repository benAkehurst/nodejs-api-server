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
/**
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  }
  return true;
};

/**
 * empty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const empty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  isEmpty,
  empty,
};
