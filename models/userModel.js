const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [5, 'A user name must have min or equal then 5 characters'],
    maxlength: [20, 'A user name must have more or equal then 20 characters'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Please add a email'],
    validate: [validator.isEmail, 'Please provide a email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'publisher'],
    required: [true, 'Please add a role'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: [6, 'A password  must have min or equal then 6 characters'],
    maxlength: [40, 'A password  must have more or equal then 40 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please comfirm your password'],
    validate: {
      // Nên nhớ chỉ hoạt động với lệnh CREATE và SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  changePasswordAt: Date,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Xoá giá trị của cột passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// Create ChangePasswordAt khi change password hoặc reset password
userSchema.pre('save', function (next) {
  // Bỏ qua khi password không thay dôi và khi tạo account
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.changePasswordAt = Date.now() - 1000; // Trừ 1000 ms để tránh login lỗi
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Check password(Mã hoá luôn password khi User nhập vào để so sánh)
userSchema.methods.checkPassword = async function (enterPassword) {
  // Nó return ra True hoặc False
  return await bcrypt.compare(enterPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  console.log('Reset Token: ', resetToken);

  // Hash resettoken and set resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set exprire 10 minite
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Check Time token vs changePasswordAt
userSchema.methods.checkChangePassword = function (JwtTimeStamp) {
  if (this.changePasswordAt) {
    // Convert date sang timestamp và đổi sang 10 chứ sô thay vì 13 (đổi giây sang ms)
    const timestampChangePW = Math.floor(
      this.changePasswordAt.getTime() / 1000
    );
    return JwtTimeStamp < timestampChangePW;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
