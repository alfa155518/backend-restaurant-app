// Global Error
const globalErrorHandler = (res, status, err) => {
  return res.status(status).json({
    status: 'fail',
    message: err.message,
    stack: err.stack,
  });
};

// error validation
const validationFailed = (res, status, error) => {
  const errors = Object.values(error.errors).map((err) => err.message);
  return res.status(status).json({
    status: 'fail',
    message: errors,
  });
};

// Error Not Has Token
const notToken = (res) => {
  return res.status(401).json({
    status: 'fail',
    message: 'No token, authorization denied You Must Signup Or Login',
  });
};

// error duplicate Key
const duplicateKey = (res) => {
  return res.status(400).json({
    status: 'fail',
    message: 'Some Thing Is Duplicated Like Phone ',
  });
};
const duplicateName = (res) => {
  return res.status(400).json({
    status: 'fail',
    message: 'Some Thing Is Duplicated Like Name ',
  });
};

// error Email Already Exit
const existingUser = (res) => {
  return res.status(409).json({
    status: 'fail',
    message: 'Email already in use',
  });
};

// error data Not Exit
const dataNotExit = (res, status, message) => {
  return res.status(status).json({
    status: 'fail',
    message,
  });
};

// error Empty Failed
const emptyFailed = (res) => {
  return res.status(400).json({
    status: 'fail',
    message: 'Please provide all field to update',
  });
};

module.exports = {
  existingUser,
  dataNotExit,
  validationFailed,
  globalErrorHandler,
  duplicateKey,
  notToken,
  emptyFailed,
  duplicateName,
};
