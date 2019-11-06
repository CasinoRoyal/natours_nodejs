const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router
  .route('/update-password')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/change-user-data')
  .patch(authController.protect, userController.changeUserData);

router
  .route('/delete-account')
  .delete(authController.protect, userController.deleteUserAccount);

router
  .route('/me')
  .get(authController.protect, userController.getMe, userController.getUser);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers);
  
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.eraseUser);

module.exports = router;