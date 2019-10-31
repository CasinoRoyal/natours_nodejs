const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-password', 
  authController.protect, 
  authController.updatePassword
);

router.patch(
  '/change-user-data',
  authController.protect,
  userController.changeUserData
);
router.delete(
  '/delete-account',
  authController.protect,
  userController.deleteUserAccount
);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.eraseUser);

module.exports = router;