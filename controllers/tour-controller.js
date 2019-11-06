const Tour = require('../models/tour-model');

const catchAsyncError = require('../utils/catch-async-error');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');

exports.getCheapestTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingsAverage';
  next();
}

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