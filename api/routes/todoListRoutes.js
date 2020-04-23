'use strict';
module.exports = (app) => {
  const todoList = require('../controllers/todoListController');

  // ToDo Routes
  app
    .route('/api/tasks/all-tasks/:token')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app
    .route('/api/tasks/:taskId/:token')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);
};
