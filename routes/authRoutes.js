const express = require('express');
const { protect } = require('../middleware/authProtect');

const authController = require('./../controllers/authController');
const {
  uploadBootcampPhoto,
  resizeBootcampPhoto,
} = require('./../middleware/uploadImage');

const router = express.Router();

router.route('/me').get(protect, authController.getMe);
router.route('/updatepassword').put(protect, authController.updatePassword);
router
  .route('/updateme')
  .put(
    protect,
    uploadBootcampPhoto,
    resizeBootcampPhoto('user', 'users'),
    authController.updateMe
  );

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').get(protect, authController.logout);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:resettoken').put(authController.resetPassword);

module.exports = router;
