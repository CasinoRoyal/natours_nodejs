const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');

const filteringAllowsFields = (reqObj, ...allowsFields) => {
  const fields = {};

  Object.keys(reqObj).forEach((el) => {
    if (allowsFields.includes(el)) {
      fields[el] = reqObj[el];
    };
  });

  return fields;
}

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

exports.changeUserData = catchAsyncError(async (req, res, next) => {
  if (req.body.password) {
    return next(new AppError('Only non-secure data can change in this route', 400));
  };

  const filteredUserRequest = filteringAllowsFields(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredUserRequest,
    { new: true, runValidators: true }
  );

  console.log(filteredUserRequest);
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.deleteUserAccount = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'NOT IMPLEMENTED YET'
  });
};

exports.eraseUser = (req, res) => {
  res.status(500).json({
    message: 'NOT IMPLEMENTED YET'
  });
};