const express = require('express');
const tourController = require('../controllers/tour-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

//router.param('id', tourController.checkID)

router
  .route('/5-cheapest-tour')
  .get(tourController.getCheapestTour,tourController.getAllTours)

router
  .route('/get-stats')
  .get(tourController.getStatsTours)

router
  .route('/month/:year')
  .get(tourController.getMonthTours)


router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'senior-guide'),
    tourController.deleteTour);

module.exports = router;