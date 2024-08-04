const User = require('../models/userModel');
const errorsControllers = require('../controllers/errorsControllers');
const cloudinary = require('cloudinary');

// Get All users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find(
      {},
      {
        password: false,
        passwordConfirm: false,
        __v: false,
      }
    ).select('-password');
    res.status(200).json({
      status: 'success',
      result: allUsers.length,
      allUsers,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Get Single User By Id From token
const getSingleUser = async (req, res) => {
  try {
    const id = await req.params.userId;
    // Get Selected User
    const selectedUser = await User.findById(id);

    // Check if the user exists
    if (!selectedUser) {
      return errorsControllers.dataNotExit(res, 404, 'User not found');
    }

    res.status(200).json({
      status: 'success',
      selectedUser,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Update user firstName and lastName
const updateSingleUser = async (req, res) => {
  try {
    // 1) Check if the new email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    const userId = await req.params.userId;

    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ error: 'Email is already in use by another user' });
    }

    // 2) Check if firstName or lastName or email is empty
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      console.log(4);
      return errorsControllers.emptyFailed(res);
    }

    // 3) Find user byId and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
      { new: true } // Return the updated document
    );
    // 4) Send Response
    res.status(201).json({
      status: 'success',
      updatedUser,
    });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      return errorsControllers.validationFailed(res, 400, err);
    } else {
      return errorsControllers.globalErrorHandler(res, 400, err);
    }
  }
};

// Delete user by id

const deleteSingleUser = async (req, res) => {
  try {
    // 1) Check if user ID is provided in the request parameters
    const userId = await req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'No user ID provided' });
    }

    // 2) Check if the user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return errorsControllers.dataNotExit(res, 404, 'User not found');
    }

    // 3) Remove Photo from Cloud Storage
    const publicId = await targetUser.photo.publicId;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 4) Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
};
