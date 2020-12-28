'use strict';
module.exports = (app) => {
  const todoList = require('../controllers/todoListController');

  app
    .route('/api/v1/tasks/create-new-task/:uniqueId/:token')
    .post(todoList.create_new_task);
  app
    .route('/api/v1/tasks/:uniqueId/:token/:taskId')
    .get(todoList.read_single_task)
    .get(todoList.read_all_user_tasks)
    .put(todoList.update_single_task)
    .delete(todoList.delete_single_task);
};
