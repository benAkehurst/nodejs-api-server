'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdOnDate: {
      type: String,
    },
    userActive: {
      type: Boolean,
      default: false,
    },
    acceptedTerms: {
      type: Boolean,
    },
    userStatus: {
      type: String,
      default: 'pending',
    },
    uniqueId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
