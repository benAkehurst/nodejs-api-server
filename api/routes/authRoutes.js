'use strict';
module.exports = function (app) {
  const userController = require('../controllers/userController');

  /**
   * User Routes
   */
  app.route('/api/login')
    .post(userController.login_a_user);

};
