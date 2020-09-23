const mongoose = require('mongoose');
const { format } = require('date-fns');
const tokenMiddleware = require('../../middlewares/token');

const Task = mongoose.model('Tasks');

/**
 * Creates a new task in the database
 * POST
 * {
 *  "task": "string",
 *  "userId": "userId from mongodb"
 *  "createdOnDate": "string that clearly shows when a task is created",
 *  "createdOnTime": "string that shows the time when a task is created"
 * }
 */
exports.create_new_task = (req, res) => {
  let newTask = new Task({
    task: req.body.task,
    user: req.body.userId,
    createdOnDate: format(new Date(), 'dd/MM/yyyy'),
    createdOnTime: format(new Date(), 'HH:mm'),
  });
  tokenMiddleware
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

exports.read_all_user_tasks = (req, res) => {
  tokenMiddleware
    .checkToken(req.params.token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        Task.find({ user: { $all: req.params.userId } }, (err, tasks) => {
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

exports.read_single_task = (req, res) => {
  tokenMiddleware
    .checkToken(req.params.token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        Task.findById(req.params.taskId, (err, task) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: "Couldn't find task",
              data: err,
            });
          }
          res.status(200).json({
            success: true,
            message: 'Single Task found',
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
 * Creates a new task in the database
 * PUT
 * {
 *  "task": "string"
 * }
 */
exports.update_single_task = (req, res) => {
  tokenMiddleware
    .checkToken(req.params.token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        Task.updateOne(
          { _id: req.params.taskId }, // Filter
          { $set: { task: req.body.task } }, // Update
          (err, task) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Couldn't update single task",
                data: err,
              });
            }
            res.status(200).json({
              success: true,
              message: 'Single task updated successfully',
            });
          }
        );
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

exports.delete_single_task = (req, res) => {
  tokenMiddleware
    .checkToken(req.params.token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        Task.remove(
          {
            _id: req.params.taskId,
          },
          (err, task) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Couldn't delete task",
                data: err,
              });
            }
            res.status(200).json({
              success: true,
              message: 'Task deleted successfully',
            });
          }
        );
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
