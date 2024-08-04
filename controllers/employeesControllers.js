const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Employees = require('../models/employeesModel');
const errorsControllers = require('../controllers/errorsControllers');
const cloudinary = require('cloudinary');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require('../utils/cloudinary');

const addEmployee = async (req, res) => {
  try {
    // 1) Check that the employee exists
    const existingEmployee = await Employees.findOne({ email: req.body.email });

    if (existingEmployee) {
      return errorsControllers.existingUser(res);
    }

    // 2) Check if image already exists
    if (!req.file) {
      return res.status(400).send({
        status: 'error',
        message: 'upload an image',
      });
    }

    // 3) Create a new employee
    const employee = await Employees.create(req.body);

    // 4) Generate Token
    const token = await jwt.sign(
      { id: employee.id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    const imagePath = await path.join(
      __dirname,
      `../uploads/${req.file.filename}`
    );

    // 5) Upload to Cloudinary
    const result = await cloudinaryUploadImage(imagePath);

    // 6) Delete Old Profile photo if exit
    if (employee.photo.publicId !== null) {
      await cloudinaryRemoveImage(employee.photo.publicId);
    }
    // 7) Change the ProfilePhoto in The DB
    employee.photo = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    // 8) Save User
    await employee.save();

    // 9) Send Response
    res.status(201).json({
      status: 'success',
      token,
      employee,
    });
    // 10) Remove Img From Images Folder
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }
  } catch (error) {
    const imagePath = await path.join(
      __dirname,
      `../uploads/${req.file.filename}`
    );
    if (error.message.includes('validation failed')) {
      if (imagePath) {
        fs.unlinkSync(imagePath);
      }
      return errorsControllers.validationFailed(res, 400, error);
    } else {
      if (imagePath) {
        fs.unlinkSync(imagePath);
      }
      return errorsControllers.globalErrorHandler(res, 400, error);
    }
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    // 1) Employee Id
    const employeeId = await req.params.employeeId;

    // 2) Get Target Employee
    const employee = await Employees.findById(employeeId);

    res.status(200).json({
      status: 'success',
      employee,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

const updateSingleEmployee = async (req, res) => {
  try {
    // 1) Employee Id
    const employeeId = await req.params.employeeId;

    // 2) Check that the employee exists
    const employee = await Employees.findById(employeeId);
    if (!employee) {
      return errorsControllers.dataNotExit(res, 404, 'Employee not found');
    }

    // 3) Check all Failed
    if ((req.body.name || req.body.job || req.body.workTime) === '') {
      return errorsControllers.emptyFailed(res);
    }

    // 4) Get Target Employee And Update
    const updatedEmployee = await Employees.findByIdAndUpdate(
      employeeId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      updatedEmployee,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employees.find();
    res.status(200).json({
      status: 'success',
      results: employees.length,
      employees,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    // 1) Get Selected Employee By ID
    const employeeId = req.params.employeeId;
    const employee = await Employees.findById(employeeId);

    // 2) Check if the employee already exists
    if (!employee) {
      return errorsControllers.dataNotExit(res, 404, 'Employee not found');
    }

    // 3) Remove Image From Cloudinary
    const publicId = await employee.photo.publicId;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    await Employees.findByIdAndDelete(employeeId);
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  addEmployee,
  getSingleEmployee,
  getAllEmployees,
  updateSingleEmployee,
  deleteEmployee,
};
