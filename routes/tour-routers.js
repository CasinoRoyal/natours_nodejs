const express = require('express');
const tourController = require('../controllers/tour-controller');

const router = express.Router();

//router.param('id', tourController.checkID)

router
  .route('/5-cheapest-tour')
  .get( tourController.getCheapestTour,tourController.getAllTours)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;