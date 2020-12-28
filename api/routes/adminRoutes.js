'use strict';
module.exports = (app) => {
  const adminController = require('../controllers/adminController');
  app.route('/api/v1/admin/get-all-users').post(adminController.get_all_users);
  app
    .route('/api/v1/admin/change-user-admin-role')
    .post(adminController.change_user_admin_role);
  app
    .route('/api/v1/admin/change-user-status')
    .post(adminController.change_user_status);
  app
    .route('/api/v1/admin/get-single-user')
    .post(adminController.get_single_user);
};
