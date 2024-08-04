const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter a First name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please enter a Last name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter a valid email address'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '{VALUE} is not a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    validate: [validator.isMobilePhone, '{VALUE} is not a valid phone number'],
  },
  photo: {
    type: Object,
    default: {
      url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      publicId: null,
    },
    required: [true, 'Select a photo'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    trim: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

// Hash User Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  await bcrypt.compare(this.passwordConfirm, this.password);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
