'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    task: {
      type: String,
    },
    user: {
      type: String,
    },
    createdOn: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tasks', TaskSchema);
