const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const bootCampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },

    slug: String,

    description: {
      type: String,
      required: [true, 'Please add description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },

    website: {
      type: String,
      required: [true, 'Please ad a Url website'],
      validate: [validator.isURL, 'Please provide a valid website'],
    },

    email: {
      type: String,
      required: [true, 'Please ad a Email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    phone: {
      type: String,
      required: [true, 'Please ad a phone'],
      maxlength: [20, 'Phone number can not be more than 500 characters'],
      trim: true,
    },

    careers: {
      type: [String],
      required: true,
      enum: {
        values: [
          'Web Development',
          'Mobile Development',
          'UI/UX',
          'Data Science',
          'Business',
          'Other',
        ],
        message:
          'Difficulty is either:Web Development,Mobile Development, UI/UX, Data Science, Business, Other ',
      },
    },

    address: {
      type: String,
      required: [true, 'Please add an address'],
    },

    location: {
      // GeoJSON Point
      type: {
        type: String,
        //required: true,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        //required: true,
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },

    averageRating: {
      type: Number,
      min: [1, 'Ratting must be at least 1'],
      max: [10, 'Ratting must can not be more than 10'],
    },

    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.ipg',
    },

    housing: {
      type: Boolean,
      default: false,
    },

    jobAssistance: {
      type: Boolean,
      default: false,
    },

    jobGuarantee: {
      type: Boolean,
      default: false,
    },

    acceptGi: {
      type: Boolean,
      default: false,
    },

    createAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bootCampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Tạo cột ảo courses vào document
bootCampSchema.virtual('courses', {
  ref: 'Course',
  foreignField: 'bootcamp',
  localField: '_id',
});

// Xoá course trước khi xoá bootcamp
bootCampSchema.pre('remove', async function (next) {
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

bootCampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  // k luu vao address vao Db
  this.address = undefined;
  next();
});

const Bootcamp = mongoose.model('Bootcamp', bootCampSchema);

module.exports = Bootcamp;
