const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'There is no Table'],
    unique: true,
    ref: 'Tables',
  },
  customer: {
    type: String,
    required: [true, 'There is no Customer'],
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
