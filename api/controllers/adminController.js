const User = require("../models/userModel");

/**
 * Fetches all users in the database
 * User has to be set isAdmin = true in DB
 */
exports.get_all_users = async (req, res) => {
  const userId = req.body.userId;
  let isAdminCheck;
  await User.findById(userId, (err, user) => {
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });
  if (isAdminCheck) {
    User.find({}, (err, users) => {
      if (err) {
        res.status(204).json({
          success: false,
          message: "No users found",
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: "All users found",
        data: users,
      });
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized",
      data: null,
    });
  }
};

/**
 * Changes a users role in the DB
 * POST
 * {
 *  "requesterId": "Mongdb ID of user that is requesting",
 *  "userId": "ID of user requesting to be changed",
 *  "isAdminValue": "true" or "false"
 * }
 */
exports.change_user_admin_role = async (req, res) => {
  const requesterId = req.body.requesterId;
  const user = req.body.userId;
  const isAdminValue = req.body.isAdminValue;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
    User.findByIdAndUpdate(
      user,
      { $set: { isAdmin: isAdminValue } },
      (err, user) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Couldn't find user",
            data: err,
          });
        }
        res.status(200).json({
          success: true,
          message: "User role changed found",
          data: null,
        });
      }
    );
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized",
      data: null,
    });
  }
};

/**
 * Changes the user to active = false
 * POST
 * {
 *  "requesterId": "Mongdb ID of user that is requesting",
 *  "userId": "ID of user requesting to be changed",
 *  "userActiveValue": "true" or "false"
 * }
 */
exports.change_user_status = async (req, res) => {
  const requesterId = req.body.requesterId;
  const user = req.body.userId;
  const userActiveValue = req.body.userActiveValue;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
    User.findByIdAndUpdate(
      user,
      { $set: { userActive: userActiveValue } },
      (err, user) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Couldn't find user",
            data: err,
          });
        }
        res.status(200).json({
          success: true,
          message: "User status changed",
          data: null,
        });
      }
    );
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized",
      data: null,
    });
  }
};

/**
 * Gets a single user in the db
 * POST
 * {
 *  "requesterId": "Mongdb ID of user that is requesting",
 *  "userId": "ID of user",
 * }
 */
exports.get_single_user = async (req, res) => {
  const requesterId = req.body.requesterId;
  const user = req.body.userId;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
    User.findById(user, (err, user) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: "Couldn't find user",
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: "User found",
        data: user,
      });
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized",
      data: null,
    });
  }
};
