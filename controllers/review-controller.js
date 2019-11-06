const Review = require('./../models/reviews-model');
const catchAsyncError = require('../utils/catch-async-error');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');

exports.addTourIdAndUserId = (req, res, next) => {
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

