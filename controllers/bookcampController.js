// @desc    Get all bookcamp
// @route   GET
exports.getAllBookcamp = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
};

// @desc    Get a bookcamp
// @route   GET
exports.getBookcamp = (req, res, next) => {
  res.status(200).json({
    status: `Show bookcamp ${req.params.id}`,
    data: null,
  });
};

// @desc    Create a bookcamp
// @route   POST
exports.createBookcamp = (req, res, next) => {
  res.status(201).json({
    status: `Show bookcamp ${req.params.id}`,
    data: null,
  });
};

// @desc    Update a bookcamp
// @route   PATCH
exports.updateBookCamp = (req, res, next) => {
  res.status(201).json({
    status: `Show bookcamp ${req.params.id}`,
    data: null,
  });
};

// @desc    Delete a bookcamp
// @route   GET
exports.deleteBookCamp = (req, res, next) => {
  res.status(201).json({
    status: `Show bookcamp ${req.params.id}`,
    data: null,
  });
};
