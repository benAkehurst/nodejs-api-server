'use strict';
module.exports = (app) => {
  const todoList = require('../controllers/todoListController');

  app.route('/api/tasks/create-new-task/:token').post(todoList.create_new_task);
  app
    .route('/api/tasks/read-all-user-tasks/:userId/:token')
    .get(todoList.read_all_user_tasks);
  app
    .route('/api/tasks/:userId/:token/:taskId')
    .get(todoList.read_single_task)
    .put(todoList.update_single_task)
    .delete(todoList.delete_single_task);
};
