const express = require('express');
const router = express.Router();

const bookcampController = require('./../controllers/bookcampController');

router
  .route('/')
  .get(bookcampController.getAllBookcamp)
  .post(bookcampController.createBookcamp);

router
  .route('/:id')
  .get(bookcampController.getBookcamp)
  .patch(bookcampController.updateBookCamp)
  .delete(bookcampController.deleteBookCamp);

module.exports = router;
