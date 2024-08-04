const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  productType: {
    type: String,
    required: true,
    enum: ['AllProduct', 'popularProduct'],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'productType',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending',
  },
});

// create order model in the database
const Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;
