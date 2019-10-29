const { promisify } = require('util');
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

exports.protect = catchAsyncError(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  //- Check if token exist
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  };

  if (!token) {
    return next(new AppError('Please log in', 401));
  };

  //- Verification token
  const decodeToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //- Check if user still exist
  const user = await User.findById(decodeToken.id);

  if (!user) {
    return next(new AppError( 'User was deleted', 401))
  }

  //- Check if user password was changed
  if (user.isPasswordChanged(decodeToken.iat)) {
    return next(new AppError( 'You are changed password, please log in', 401))
  };

  //- Saving current user in request for next middleware
  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      next(new AppError('Action denied', 403))
    }
  }
}