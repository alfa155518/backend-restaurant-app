const mongoose = require('mongoose');
const validator = require('validator');

const employeesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter employee name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter employee email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '{VALUE} is not a valid email'],
  },
  job: {
    type: String,
    enum: [
      'Manager',
      'Assistant Manager',
      'Head Chef',
      'Chef',
      'Sous Chef',
      'Waiter',
      'Host',
      'Cleaner',
    ],
    required: [true, 'Please enter employee Job'],
  },
  workTime: {
    type: String,
    required: [true, 'Please enter Work Time'],
  },
  photo: {
    type: Object,
    default: {
      url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      publicId: null,
    },
  },
});

const employees = mongoose.model('employee', employeesSchema);

module.exports = employees;
