const mongoose = require('mongoose');

const allProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a product name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter a product description'],
  },
  price: {
    type: String,
    trim: true,
    required: [true, 'Please enter a product price'],
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'Please enter a product category'],
  },
  image: {
    type: String,
    required: [true, 'Please enter a product image'],
  },
  quantity: {
    type: Number,
    trim: true,
    default: 1,
  },
  rating: {
    type: Number,
    trim: true,
    default: 4,
  },
});

const AllProducts = mongoose.model('AllProduct', allProductsSchema);

module.exports = AllProducts;
