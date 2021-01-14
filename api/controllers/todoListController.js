const mongoose = require('mongoose');
const { format } = require('date-fns');
const tokenMiddleware = require('../../middlewares/token');
const { checkUserExists } = require('../../middlewares/validators');
const Task = require('../models/taskModel');

/**
 * Creates a new task in the database
 * POST
 * {
 *  "task": "",
 * }
 */
exports.create_new_task = async (req, res) => {
  const { uniqueId, token } = req.params;
  const { task } = req.body;
  if (!uniqueId || !token || !task) {
    res.status(400).json({
      success: false,
      message: 'Missing request data',
      data: null,
    });
  } else {
    try {
      let tokenValid = await tokenMiddleware.checkToken(token);
      let userExists = await checkUserExists(uniqueId);
      if (tokenValid.success && userExists) {
        let newTask = new Task({
          task: task,
          user: uniqueId,
          createdOnDate: format(new Date(), 'dd/MM/yyyy'),
          createdOnTime: format(new Date(), 'HH:mm'),
        });
        await newTask.save((err, task) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: `Couldn't save new task.`,
              data: err,
            });
          } else {
            res.status(200).json({
              success: false,
              message: `Task saved successfully.`,
              data: task,
            });
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Couldn't find user or token invalid.`,
          data: null,
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong creating a task - General Error',
        data: null,
      });
    }
  }
};

/**
 * Gets all user tasks from the DB
 * GET
 * PARAMS: /:uniqueId /:token
 */
exports.read_all_user_tasks = async (req, res) => {
  const { uniqueId, token } = req.params;
  if (!uniqueId || !token) {
    res.status(400).json({
      success: false,
      message: 'Missing request data',
      data: null,
    });
  } else {
    try {
      let tokenValid = await tokenMiddleware.checkToken(token);
      let userExists = await checkUserExists(uniqueId);
      if (tokenValid.success && userExists) {
        Task.find({ user: { $all: uniqueId } }, (err, tasks) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: 'No tasks fround.',
              data: err,
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Tasks fround.',
            data: tasks,
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Couldn't find user or token invalid.`,
          data: null,
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong fetching all tasks - General Error',
        data: null,
      });
    }
  }
};

/**
 * Gets all user tasks from the DB
 * GET
 * PARAMS: /:uniqueId /:token /:taskId
 */
exports.read_single_task = async (req, res) => {
  const { uniqueId, token, taskId } = req.params;
  if (!uniqueId || !token || !taskId) {
    res.status(400).json({
      success: false,
      message: 'Missing request data',
      data: null,
    });
  } else {
    try {
      let tokenValid = await tokenMiddleware.checkToken(token);
      let userExists = await checkUserExists(uniqueId);
      if (tokenValid.success && userExists) {
        Task.findById(taskId, (err, task) => {
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
      } else {
        res.status(400).json({
          success: false,
          message: `Couldn't find user or token invalid.`,
          data: null,
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong reading single task - General Error',
        data: null,
      });
    }
  }
};

/**
 * Creates a new task in the database
 * PUT
 * PARAMS: /:uniqueId /:token /:taskId
 * {
 *  "task": ""
 * }
 */
exports.update_single_task = async (req, res) => {
  const { uniqueId, token, taskId } = req.params;
  const { task } = req.body;
  if (!uniqueId || !token || !taskId || !task) {
    res.status(400).json({
      success: false,
      message: 'Missing request data',
      data: null,
    });
  } else {
    try {
      let tokenValid = await tokenMiddleware.checkToken(token);
      let userExists = await checkUserExists(uniqueId);
      if (tokenValid.success && userExists) {
        Task.updateOne(
          { _id: taskId },
          { $set: { task: task } },
          { new: true },
          (err, task) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Couldn't update single task.",
                data: err,
              });
            }
            res.status(200).json({
              success: true,
              message: 'Single task updated successfully.',
              data: task,
            });
          }
        );
      } else {
        res.status(400).json({
          success: false,
          message: `Couldn't find user or token invalid.`,
          data: null,
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong updating single task - General Error',
        data: null,
      });
    }
  }
};

/**
 * Creates a new task in the database
 * DELETE
 * PARAMS: /:uniqueId /:token /:taskId
 */
exports.delete_single_task = async (req, res) => {
  const { uniqueId, token, taskId } = req.params;
  if (!uniqueId || !token || !taskId) {
    res.status(400).json({
      success: false,
      message: 'Missing request data',
      data: null,
    });
  } else {
    try {
      let tokenValid = await tokenMiddleware.checkToken(token);
      let userExists = await checkUserExists(uniqueId);
      if (tokenValid.success && userExists) {
        Task.remove({ _id: taskId }, { new: true }, (err, task) => {
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
            data: task,
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Couldn't find user or token invalid.`,
          data: null,
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong reading single task - General Error',
        data: null,
      });
    }
  }
};
