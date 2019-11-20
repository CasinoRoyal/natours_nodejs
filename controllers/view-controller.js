const Tour = require('./../models/tour-model');
const Booking = require('../models/booking-model');
const catchAsyncError = require('./../utils/catch-async-error');
const AppError = require('./../utils/app-error');

exports.getOverview = catchAsyncError(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    tours
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  const tourFilter = (req.params.slug);

  const tour = await Tour.findOne({slug: tourFilter}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('This tour not found', 404));
  };

  res.status(200).render('tour', {
    tourTitle: `${tour.name} Tour`,
    tour
  });
});

exports.getAuth = (req, res) => {
  res.status(200).render('login', {
    tourTitle: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    tourTitle: 'Account page'
  });
};

exports.getMyTours = catchAsyncError(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    tourTitle: 'My Tours',
    tours
  });
});
