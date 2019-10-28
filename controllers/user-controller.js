const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'NOT IMPLEMENTED YET'
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'NOT IMPLEMENTED YET'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'NOT IMPLEMENTED YET'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'NOT IMPLEMENTED YET'
  });
};