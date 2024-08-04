const mongoose = require('mongoose');

const popularProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    default:4,
  },
})

const popularProducts = mongoose.model('popularProduct', popularProductsSchema);

module.exports = popularProducts;