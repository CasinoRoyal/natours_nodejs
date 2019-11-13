const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect)

router
  .route('/update-password')
  .patch(authController.updatePassword);

router
  .route('/change-user-data')
  .patch(userController.uploadUserPhoto, userController.changeUserData);
  //.patch(userController.uploadUserPhoto, userController.resizeUserPhoto, userController.changeUserData);

router
  .route('/delete-account')
  .delete(userController.deleteUserAccount);

router
  .route('/me')
  .get(userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers);
  
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.eraseUser);

module.exports = router;