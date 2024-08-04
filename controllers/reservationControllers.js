const jwt = require('jsonwebtoken');
const fs = require('fs');
const Reservation = require('../models/reservationModel');
const User = require('../models/userModel');
const Table = require('../models/tablesModel');
const errorsControllers = require('./errorsControllers');
const { sendMail } = require('../utils/mail');
const emailContent = require('../utils/emailContent');
const reserveTable = async (req, res) => {
  try {
    // Get table id from request parameters.
    const tableId = req.params.tableId;

    // Check if table ID is provided in the request parameters.
    if (!tableId) {
      return res.status(400).json({ error: 'No table ID provided' });
    }

    // Check if table ID is provided in the request headers.
    const token = await req.headers['authorization'].split(' ')[1];

    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Create a new reservation record in the database.
    const reservation = await Reservation.create({
      table: tableId,
      customer: user.data,
    });

    const userTable = await Table.findById(tableId);

    const userData = await User.findById(user.data);

    // crete a email message to the reservation
    await sendMail(
      userData.email,
      'Reservation Table successfully💥',
      emailContent.newReservationEmailContent(userData, userTable)
    );
    sendMail();
    res.status(201).json({
      status: 'success',
      reservation,
    });
  } catch (err) {
    if (err) {
      return errorsControllers.globalErrorHandler(res, 400, err);
    }
  }
};

// Show All Reservations for Admin
const showAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('table')
      .populate('customer');

    res.status(200).json({
      status: 'success',
      reservations,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server Error',
    });
  }
};

// get reserve depend on user id
const getReservationsByUserId = async (req, res) => {
  try {
    // Check if table ID is provided in the request header.
    const token = await req.headers['authorization'].split(' ')[1];

    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Get selected User Reservation.
    const reserve = await Reservation.findOne({ customer: user.data })
      .populate('table')
      .populate('customer');

    res.status(200).json({
      status: 'success',
      reserve,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server Error',
    });
  }
};

// Update Reservation Status
const updateReservationStatus = async (req, res) => {
  try {
    const reserveId = await req.params.targetReserve;

    const updatedData = await Reservation.findByIdAndUpdate(
      reserveId,
      {
        status: req.body.status,
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      status: 'success',
      updatedData,
    });
  } catch (err) {
    if (err) {
      return errorsControllers.globalErrorHandler(res, 400, err);
    }
  }
};

// delete reservation
const deleteReservation = async (req, res) => {
  try {
    const reserveId = await req.params.reservationId;

    if (!reserveId) {
      return errorsControllers.dataNotExit(res, 400, 'Reservation not found');
    }

    await Reservation.findByIdAndDelete(reserveId);
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = {
  reserveTable,
  showAllReservations,
  getReservationsByUserId,
  deleteReservation,
  updateReservationStatus,
};
