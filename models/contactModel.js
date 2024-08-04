const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Message must be belong a user'],
  },
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    validate: [validator.isEmail, '{VALUE} is not a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone'],
    validate: [validator.isMobilePhone, '{VALUE} is not a valid phone number'],
  },
  message: {
    type: String,
    required: [true, 'Please enter your message'],
    minlength: [10, 'Message is too short'],
  },
  createdAt: {
    type: String,
  },
});

// formate message time
contactSchema.pre('save', function (next) {
  this.createdAt = moment().format('YYYY-MM-DD');
  next();
});

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
