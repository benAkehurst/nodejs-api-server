'use strict';
module.exports = (app) => {
  const todoList = require('../controllers/todoListController');

  app
    .route('/api/v1/tasks/create-new-task/:uniqueId/:token')
    .post(todoList.create_new_task);
  app.route('/api/v1/tasks/:uniqueId/:token').get(todoList.read_all_user_tasks);
  app
    .route('/api/v1/tasks/:uniqueId/:token/:externalId')
    .get(todoList.read_single_task)
    .put(todoList.update_single_task)
    .delete(todoList.delete_single_task);
};
