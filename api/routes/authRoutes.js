'use strict';
module.exports = (app) => {
  const authController = require('../controllers/authController');
  app.route('/api/auth/create-new-user').post(authController.create_new_user);
  app.route('/api/auth/login-user').post(authController.login_user);
  app
    .route('/api/auth/check-token-valid/:token')
    .get(authController.check_token_valid);
};
