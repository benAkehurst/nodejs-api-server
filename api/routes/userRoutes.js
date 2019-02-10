'use strict';
module.exports = function (app) {
  const userController = require('../controllers/userController');

  /**
   * User Routes
   */
  app.route('/api/user')
  .get(userController.get_all_users)
  .post(userController.create_a_user);

  /**
   * Individual User Routes
   */
  app.route('/api/user/:userId')
    .get(userController.get_single_user)
    .put(userController.update_a_user)
    .put(userController.delete_a_user)
    .delete(userController.delete_a_user);
  };
