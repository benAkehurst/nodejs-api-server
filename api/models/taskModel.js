'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    task: {
      type: String,
    },
    externalId: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: String,
    },
    createdOnDate: {
      type: String,
    },
    createdOnTime: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
