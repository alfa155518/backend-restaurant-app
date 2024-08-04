const Contact = require('../models/contactModel');
const errorsControllers = require('../controllers/errorsControllers');
const jwt = require('jsonwebtoken');

// Create a new contact message
const contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = await req.body;

    const token = await req.headers.authorization.split(' ')[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await decoded.data;

    const contactUs = await Contact.create({
      user,
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    res.status(201).json({
      status: 'success',
      contactUs,
    });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      return errorsControllers.validationFailed(res, 422, err);
    } else {
      return errorsControllers.globalErrorHandler(res, 400, err);
    }
  }
};

// Show all Contact message
const getAllContactMessage = async (req, res) => {
  try {
    const contactUs = await Contact.find().populate('user').populate({
      path: 'user',
      select: 'photo',
    });

    res.status(200).json({
      status: 'success',
      messageNumbers: contactUs.length,
      contactUs,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Delete a contact message by id
const deleteContactMessage = async (req, res) => {
  try {
    const contactId = req.params.messageId;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return errorsControllers.dataNotExit(res, 404, 'Contact not found');
    }
    await Contact.findByIdAndDelete(contactId);
    res.status(200).json({
      status: 'success',
      message: 'Contact deleted successfully',
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};
module.exports = { contactUs, getAllContactMessage, deleteContactMessage };
