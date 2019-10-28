const jwt = require('jsonwebtoken');
const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = generateToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Check email or password', 400));
  };

  const user = await User.findOne({email}).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError('Wrong email and/or password', 401));
  };

  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  })
});