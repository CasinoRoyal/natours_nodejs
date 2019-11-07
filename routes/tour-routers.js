const express = require('express');
const tourController = require('../controllers/tour-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');
const reviewRouter = require('./../routes/review-routes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/5-cheapest-tour')
  .get(tourController.getCheapestTour,tourController.getAllTours)

router
  .route('/get-stats')
  .get(tourController.getStatsTours)

router
  .route('/month/:year')
  .get(protect, restrictTo('admin', 'lead-guide'), tourController.getMonthTours);


router
  .route('/')
  .get(tourController.getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;