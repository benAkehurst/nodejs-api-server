'use strict';
module.exports = (app) => {
  const authController = require('../controllers/authController');
  app
    .route('/api/v1/auth/create-new-user')
    .post(authController.create_new_user);
  app.route('/api/v1/auth/login-user').post(authController.login_user);
  app
    .route('/api/v1/auth/check-token-valid-external/:token')
    .get(authController.check_token_valid_external);
};
