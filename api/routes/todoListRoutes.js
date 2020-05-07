'use strict';
module.exports = (app) => {
  const todoList = require('../controllers/todoListController');

  // ToDo Routes
  app.route('/api/tasks/create-new-task/:token').post(todoList.create_new_task);

  app
    .route('/api/tasks/list-all-tasks/:token/:userId')
    .get(todoList.list_all_tasks);

  app
    .route('/api/tasks/:token/:taskId:/:userId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);
};
