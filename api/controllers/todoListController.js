'use strict';
const mongoose = require('mongoose');
const Task = mongoose.model('Tasks');

let middleware = require('../../middlewares/middleware');

/**
 * Creates a new task in the datebase
 */
exports.create_new_task = (req, res) => {
  let newTask = new Task({
    task: req.body.task,
    user: req.body.userId,
  });
  middleware
    .checkToken(req.params.token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        newTask.save((err, task) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "Couldn't create new task",
              data: null,
            });
          }
          return res.status(201).json({
            success: true,
            message: 'Task created',
            data: task,
          });
        });
      }
    })
    .catch((promiseError) => {
      if (promiseError) {
        return res.status(500).json({
          success: false,
          message: 'Bad Token',
          data: null,
        });
      }
    });
};

/**
 * Lists all the tasks in the DB
 */
exports.list_all_tasks = (req, res) => {
  middleware
    .checkToken(req.params.token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        Task.find({ user: req.params.userId }, (err, tasks) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'No tasks fround',
              data: err,
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Tasks fround',
            data: tasks,
          });
        });
      }
    })
    .catch((promiseError) => {
      if (promiseError) {
        return res.status(500).json({
          success: false,
          message: 'Bad Token',
          data: null,
        });
      }
    });
};

exports.read_a_task = (req, res) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't find task",
        code: 400,
      });
    }
    res.send({
      message: 'Task found',
      data: task,
      code: 200,
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
          message: "Couldn't update task",
          code: 400,
        });
      }
      res.send({
        message: 'Task updated successfully',
        data: task,
        code: 200,
      });
    }
  );
};

exports.delete_a_task = (req, res) => {
  Task.remove(
    {
      _id: req.params.taskId,
    },
    (err, task) => {
      if (err) {
        res.send({
          error: err,
          message: "Couldn't delete task",
          code: 400,
        });
      }
      res.send({
        message: 'Task deleted successfully',
        data: task,
        code: 200,
      });
    }
  );
};
