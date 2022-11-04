const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an title'],
    maxlength: [40, 'Title of review not more 40 characters'],
  },
  text: {
    type: String,
    required: [true, 'Please add an text'],
    maxlength: [200, 'Title of review not more 200 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Please add an rating'],
    max: [10, 'Rating of review not great than 10'],
    min: [1, 'Title of review let than 1'],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Static method to get avg of review rating
reviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(obj);
  if (obj.length > 0) {
    console.log(obj[0].averageRating);
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      // Math.ceil dùng để làm tròn
      averageRating: Math.ceil((obj[0].averageRating / 10) * 10),
    });
  } else {
    console.log('khong chay');
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      // Math.ceil dùng để làm tròn
      averageRating: 9,
    });
  }
};

// Call affter create/update 1 review
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

// Call affter remove 1 review
reviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
