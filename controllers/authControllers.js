const fs = require('fs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const cloudinary = require('cloudinary');
const errorsControllers = require('../controllers/errorsControllers');
const { sendMail } = require('../utils/mail');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require('../utils/cloudinary');

// Signup User
const signup = async (req, res) => {
  // 1) check if there any data is duplicated
  const duplicateData = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  try {
    //2) Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return errorsControllers.existingUser(res);
    }

    // 3) Check if image already exists
    if (!req.file) {
      return res.status(400).send({
        status: 'error',
        message: 'upload an image',
      });
    }
    //4) Create User
    const newUser = await User.create(req.body);

    //5) Generate Token
    const token = await jwt.sign(
      { data: newUser.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    //6) Upload to Cloudinary
    const imagePath = await path.join(
      __dirname,
      `../uploads/${req?.file?.filename}`
    );
    const result = await cloudinaryUploadImage(imagePath);

    //7) Delete Old Profile photo if exit
    if (newUser.photo.publicId !== null) {
      await cloudinaryRemoveImage(newUser.photo.publicId);
    }
    // 8) Change the ProfilePhoto in The DB
    newUser.photo = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    // 9) Save User
    await newUser.save();

    res.status(201).json({
      status: 'signup successful',
      token,
      newUser,
    });
    // 10) Remove Img From Images Folder
    if (imagePath) {
      fs?.unlinkSync(imagePath);
    }
  } catch (error) {
    // Handle specific errors
    const imagePath = await path.join(
      __dirname,
      `../uploads/${req?.file?.filename}`
    );
    if (error.message.includes('validation failed')) {
      if (imagePath) {
        fs?.unlinkSync(imagePath);
      }
      return errorsControllers.validationFailed(res, 400, error);
    } else if (duplicateData) {
      if (imagePath) {
        fs?.unlinkSync(imagePath);
      }
      return errorsControllers.duplicateKey(res);
    } else {
      if (imagePath) {
        fs?.unlinkSync(imagePath);
      }
      return errorsControllers.globalErrorHandler(res, 400, error);
    }
  }
};

// Login User
const login = async (req, res) => {
  try {
    //1) Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return errorsControllers.dataNotExit(res, 401, 'Invalid email');
    }
    //2) Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return errorsControllers.dataNotExit(res, 401, 'Invalid password');
    }
    // 3) Send message to user by email address
    await sendMail(
      existingUser.email,
      'Congratulations!💥',
      'You Are Logged In Successfully In Restaurant App'
    );
    // 4) Generate Token
    const newToken = jwt.sign(
      { data: existingUser.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({
      status: 'login successful',
      newToken,
      existingUser,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Logout

const logout = async (req, res) => {
  try {
    //1) Handle Token
    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.data;

    const selectedUser = await User.findById(userId);

    // 2) Check if there id
    if (!selectedUser) {
      return errorsControllers.dataNotExit(
        res,
        401,
        "'No token, authorization denied You Must Signup'"
      );
    }

    // 3) Remove Photo from Cloud Storage
    const publicId = await selectedUser.photo.publicId;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 4) delete user By Id
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      status: 'logout successful',
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Update user Password
const updatePassword = async (req, res) => {
  try {
    // 1) get user By Id from token
    const userToken = await req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.data;
    const selectedUser = await User.findById(userId);
    // 2) check before password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.currentPassword,
      selectedUser.password
    );
    if (!isPasswordCorrect) {
      return errorsControllers.dataNotExit(
        res,
        400,
        'Invalid currentPassword Is Not Correct'
      );
    }
    // 3) Update Password and Confirm Password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: await bcrypt.hash(req.body.newPassword, 12),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // 4) Send message to user by email address
    await sendMail(
      updatedUser.email,
      'Done !',
      'Your Password Has Been Updated Successfully In Restaurant App'
    );
    // 5) Save User and send data
    res.status(200).json({
      status: 'update password successful',
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

module.exports = {
  signup,
  login,
  logout,
  updatePassword,
};
