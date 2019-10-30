const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');
const sendEmail = require('./../utils/emails');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

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
  });
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
};

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    next(new AppError('User with that email address not found', 404));
  };

  //- Generate random token
  const resetToken = user.createForgotPasswordToken();
  //- Turn off validation in moongoose schema on this route
  await user.save({validateBeforeSave: false});

  //- Send token to user email
  const resetUrl = `
    ${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}
  `;

  const message = `
    Forgot password? Create new password and submit it on: ${resetUrl}.
    \nToken alive 10 min. Hurry up.
    \nIf it was not you, just ignore that mail.
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password changing token',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token was send to user email'
    });
  } catch(err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpire = undefined;
    await user.save({validateBeforeSave: false});

    next(new AppError('Cant send email. Try later.', 500));
  };
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //- Get token from url params
  //- Then encrypt that token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //- Finding user with our encrypted token 
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpire: { $gt: Date.now() }
  });

  //- Cheking if token exist update user password
  if (!user) {
    return next(new AppError('Wrong token or token has expired', 400));
  };

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordTokenExpire = undefined;
  await user.save();

  //- Creating new auth token for user
  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});