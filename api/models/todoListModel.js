'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: 'Please enter task name'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: string,
      enum: ['pending', 'ongoing', 'completed', 'deleted']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Tasks', TaskSchema);
