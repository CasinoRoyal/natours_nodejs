const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');
const featuresAPI = require('../utils/features-api');

exports.deleteOne = (Model) => catchAsyncError(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  
  if (!doc) {
    return next(new AppError('This ID not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateOne = (Model) => catchAsyncError(async (req, res, next) => {
  if (req.files) {
    req.body.imageCover = req.files.imageCover[0].filename;

    req.body.images = req.files.images.map((image) => image.filename);
  };

  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('The document with this ID not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.createOne = (Model) => catchAsyncError(async (req, res, next) => {
  if (req.files) {
    req.body.imageCover = req.files.imageCover[0];
    req.body.images = req.files.images;
  };

  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      doc
    }
  })
});

exports.getOne = (Model, populateOptions) => catchAsyncError(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  
  if (populateOptions) {
    query = query.populate(populateOptions);
  }

  const doc = await query;

  if (!doc) {
    return next(new AppError('This ID not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.getAll = (Model) => catchAsyncError(async (req, res, next) => {
  //- This piece of code give review-controller allow to filter reviews
  //- only for current tour
  let tourFilterById = {};
  if (req.params.tourId) {
    tourFilterById = { tour: req.params.tourId };
  };

  const features = new featuresAPI(Model.find(tourFilterById), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const docs = await features.query;

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      docs
    }
  });
});