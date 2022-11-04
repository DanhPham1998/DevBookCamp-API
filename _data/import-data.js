const fs = require('fs');
const connectDB = require('./../config/db');
require('dotenv').config({ path: './config/.env' });
const BootCamp = require('./../models/bootcampModel');
const Course = require('./../models/courseModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');

connectDB();

// READ FILE JS
const bootcampJS = JSON.parse(
  fs.readFileSync(`${__dirname}/bootcamps.json`, 'utf-8')
);
const courseJS = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);

const userJS = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviewJS = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA JSON IN DB
const importData = async () => {
  try {
    await BootCamp.create(bootcampJS);
    await Course.create(courseJS);
    await User.create(userJS, { validateBeforeSave: false });
    await Review.create(reviewJS, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA IN DB
const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Delete all document successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // Kill khỏi vòng conect
};

// DELETE DATA IN DB
const deleteCollection = async () => {
  try {
    await BootCamp.collection.drop();
    await Course.collection.drop();
    console.log('Delete all collection successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // Kill khỏi vòng conect
};

// Hàm xử lý khí nhập thêm "node _data/import-data.js --import"
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--deleteCollection') {
  deleteCollection();
}
