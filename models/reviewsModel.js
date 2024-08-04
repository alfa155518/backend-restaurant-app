const mongoose = require('mongoose');


const reviewsSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true,"Please enter a review Message"],
  },
  rating: {
    type: String,
    default:4,
    required: [true,"Please enter a rating"],
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be belong a user'],
  },
  tableName: {
    type: String,
    required: [true, 'Review must be belong a table Name'],
  }
})

const Reviews = mongoose.model('Review', reviewsSchema);

module.exports = Reviews;