const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
    minlength: [5, 'A course name must have more or equal then 5 characters'],
    maxlength: [40, 'A course name must have more or equal then 10 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
    minlength: [
      20,
      'A description name must have more or equal then 20 characters',
    ],
  },
  weeks: {
    type: Number,
    required: [true, 'Please add a course weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a course tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a course minimumSkill'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'MinimumSkill is either:beginner,intermediate,advanced',
    },
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: [true, 'A Course need Bootcamp'],
  },
});

//Ref tới bảng bootcamps , chạy trước khi được gọi find
// courseSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'bootcamp',
//     select: 'name description', // chỉ lấy 2 thuộc tính này khi show
//   });
//   next();
// });

// Static method to get avg of course tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  console.log(obj);
  console.log(obj.length);
  // Update lại document Bootcamp để thêm averageCost
  if (obj.length > 0) {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      // Math.ceil dùng để làm tròn
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } else {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: 0,
    });
  }
};

// Call getAverageCost affte save
courseSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost affte remove
courseSchema.post('remove', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
