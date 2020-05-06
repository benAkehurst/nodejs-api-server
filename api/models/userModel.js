'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
    userActive: {
      type: Boolean,
      default: [true],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
