'use strict';
const mongoose = require('mongoose');
const Task = mongoose.model('Tasks');

exports.list_all_tasks = (req, res) => {
  Task.find({}, (err, tasks) => {
    if (err) {
      res.send({
        error: err,
        message: 'No tasks fround',
        code: 204
      });
    }
    res.send({
      message: 'All tasks returned',
      data: tasks,
      code: 200
    });
  });
};

exports.create_a_task = (req, res) => {
  const newTask = new Task(req.body);
  newTask.save((err, task) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t create new task',
        code: 400
      });
    }
    res.send({
      message: 'Task created',
      data: task,
      code: 201
    });
  });
};

exports.read_a_task = (req, res) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t find task',
        code: 400
      });
    }
    res.send({
      message: 'Task found',
      data: task,
      code: 200
    });
  });
};

exports.update_a_task = (req, res) => {
  Task.findByIdAndUpdate(
    { _id: req.params.taskId },
    req.body, 
    { new: true }, 
    (err, task) => {
      if (err) {
        res.send({
          error: err,
            message: 'Couldn\'t update task',
            code: 400
        });
      };
      res.send({
        message: 'Task updated successfully',
        data: task,
        code: 200
      });
    });
};

exports.delete_a_task = (req, res) => {
  Task.remove({
    _id: req.params.taskId
  }, 
  (err, task) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t delete task',
        code: 400
      });
    }
    res.send({
      message: 'Task deleted successfully',
      data: task,
      code: 200
    });
  });
}
