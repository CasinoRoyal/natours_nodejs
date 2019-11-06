const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');
const factory = require('./handler-factory');

const filteringAllowsFields = (reqObj, ...allowsFields) => {
  const fields = {};

  Object.keys(reqObj).forEach((el) => {
    if (allowsFields.includes(el)) {
      fields[el] = reqObj[el];
    };
  });

  return fields;
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.eraseUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
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