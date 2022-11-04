const express = require('express');

const { protect, authorize } = require('./../middleware/authProtect');
const userController = require('./../controllers/userController');

const router = express.Router();

router.use(protect, authorize('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
