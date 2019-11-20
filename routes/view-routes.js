const express = require('express');
const viewController = require('./../controllers/view-controller');
const { isLoggedIn, protect } = require('./../controllers/auth-controller');
const bookingController = require('../controllers/booking-controller');

const router = express.Router();

router.get('/', isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewController.getTour);
router.get('/login', isLoggedIn, viewController.getAuth);
router.get('/me', protect, viewController.getAccount);

router.get(
  '/my-tours',
  protect,
  viewController.getMyTours
);



module.exports = router;