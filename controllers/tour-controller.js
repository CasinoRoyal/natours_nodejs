const multer = require('multer');
const Tour = require('../models/tour-model');
const catchAsyncError = require('../utils/catch-async-error');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/tours');
  },
  filename: (req, file, cb) => {
    const fileExt = file.mimetype.split('/')[1];
    const imageName = file.fieldname === 'imageCover' ? 
      `tour-${req.params.id}-${Date.now()}-cover.${fileExt}`
      : 
      `tour-${req.params.id}-${Date.now()}.${fileExt}`;
    
    cb(null, imageName);
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

exports.uploadTourPhotos = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.getCheapestTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingsAverage';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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

exports.getToursWithin = catchAsyncError(async (req, res, next) => {
  const { distance, coordinates, unit } = req.params;
  const [lat, lng] = coordinates.split(',');
  const radians = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(new AppError('Please provide correct coordinates', 400)); 
  };

  const tours = await Tour.find({
    'startLocation': { $geoWithin: { $centerSphere: [[lng, lat], radians] } } 
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getToursDistances = catchAsyncError(async (req, res, next) => {
  const { coordinates, unit } = req.params;
  const [lat, lng] = coordinates.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(new AppError('Please provide correct coordinates', 400)); 
  };


  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      distances
    }
  });

});