const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');
const path = require('path');
const errorsControllers = require('../controllers/errorsControllers');
const { cloudinaryUploadImage } = require('../utils/cloudinary');

// Get Single User By Id From token
const getSingleUser = async (req, res) => {
  try {
    // Get User Token
    const userToken = await req.headers.authorization.split(' ')[1];

    // Verify Token And Get User Id
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

    // Get Selected User
    const selectedUser = await User.findById(decoded.data);

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

// Delete Single User By Id
const deleteUserById = async (req, res) => {
  try {
    // Get User Token
    const userToken = await req.headers.authorization.split(' ')[1];

    // Verify Token And Get User Id
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

    // Check if the user with the decoded ID exists
    const user = await User.findById(decoded.data);
    if (!user) {
      return errorsControllers.dataNotExit(res, 404, 'user Not Exit');
    }
    // Delete User
    await user.deleteOne();
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Update user firstName and lastName
const updateUserName = async (req, res) => {
  try {
    // 1) Get user by id from token
    const userToken = await req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

    // 2) Check if the new email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser && existingUser._id.toString() !== decoded.id) {
      return res
        .status(400)
        .json({ error: 'Email is already in use by another user' });
    }

    // 3) Find user byId and update
    const updatedUser = await User.findByIdAndUpdate(
      decoded.data,
      {
        firstName: req.body.firstName,
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
// Update user Photo
const updateUserPhoto = async (req, res) => {
  try {
    // 1) Get user by id from token
    const userToken = await req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    const updatedUser = await User.findById(decoded.data);

    // 3) Check if image already exists
    if (!req.file) {
      return res.status(400).send({
        status: 'error',
        message: 'upload an image',
      });
    }

    // 4) Upload to Cloudinary
    const imagePath = await path.join(
      __dirname,
      `../uploads/${req.file.filename}`
    );
    const result = await cloudinaryUploadImage(imagePath);

    // 5) Remove Old Photo From Cloudinary
    const publicId = await updatedUser.photo.publicId;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 6) Change the ProfilePhoto in The DB
    updatedUser.photo = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    // 7) Save User
    await updatedUser.save();

    // 8) Send Response
    res.status(200).json({
      status: 'success',
      updatedUser,
    });

    // 9) Remove Img From Images Folder
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }
  } catch (err) {
    const imagePath = await path.join(
      __dirname,
      `../uploads/${req.file.filename}`
    );
    if (err.message.includes('validation failed')) {
      if (imagePath) {
        fs.unlinkSync(imagePath);
      }
      return errorsControllers.validationFailed(res, 400, err);
    } else {
      if (imagePath) {
        fs.unlinkSync(imagePath);
      }
      return errorsControllers.globalErrorHandler(res, 400, err);
    }
  }
};

module.exports = {
  deleteUserById,
  getSingleUser,
  updateUserName,
  updateUserPhoto,
};
