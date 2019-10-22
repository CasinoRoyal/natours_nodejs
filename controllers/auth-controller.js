const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');

exports.singup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    user: newUser
  });
});