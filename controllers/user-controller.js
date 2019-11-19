const multer = require('multer');
const User = require('./../models/user-model');
const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');
const factory = require('./handler-factory');

//const multerStorage = multer.memoryStorage();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const fileExt = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${fileExt}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('You can upload only image file', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const filteringAllowsFields = (reqObj, ...allowsFields) => {
  const fields = {};

  Object.keys(reqObj).forEach((el) => {
    if (allowsFields.includes(el)) {
      fields[el] = reqObj[el];
    };
  });

  return fields;
};

exports.uploadUserPhoto = upload.single('photo');

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

  if (req.file) {
    filteredUserRequest.photo = req.file.filename;
  };

  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredUserRequest,
    { new: true, runValidators: true }
  );

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