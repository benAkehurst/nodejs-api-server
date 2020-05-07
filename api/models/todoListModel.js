'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    task: {
      type: String,
      required: 'Please enter task name',
    },
    user: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tasks', TaskSchema);
