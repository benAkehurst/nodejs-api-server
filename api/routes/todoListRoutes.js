'use strict';
module.exports = function(app) {
  const todoList = require('../controllers/todoListController');

  // ToDo Routes
  app.route('/api/tasks')
  .get(todoList.list_all_tasks)
  .post(todoList.create_a_task);

  app.route('/api/tasks/:taskId')
  .get(todoList.read_a_task)
  .put(todoList.update_a_task)
  .delete(todoList.delete_a_task);
};
