const Tour = require('../models/tour-model');
const featuresAPI = require('../utils/features-api');
const catchAsyncError = require('../utils/catch-async-error');
const AppError = require('../utils/app-error');

exports.getCheapestTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingsAverage';
  next();
}

exports.getAllTours = catchAsyncError(async (req, res, next) => {
  const features = new featuresAPI(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('This ID not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  })
});

exports.updateTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError('This ID not found', 404));
  }

  res.status(200).json({
    status: 'success',
    tour
  });
});

exports.deleteTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  
  if (!tour) {
    return next(new AppError('This ID not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getStatsTours = catchAsyncError(async (req, res, next) => {
  const stat = await Tour.aggregate([
    {
      $match: {
        maxGroupSize: { $gte: 5 }
      }
    },
    { 
      $group: { 
        _id: '$difficulty',
        averageAll: { $avg: '$price' },
        averageMin: { $min: '$price' },
        averageMax: { $max: '$price' },
      } 
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: stat
  });    
});


exports.getMonthTours = catchAsyncError(async (req, res, next) => {
  const year = parseInt(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates' 
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    { 
      $group: { 
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' }
      } 
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: plan
  });    
});