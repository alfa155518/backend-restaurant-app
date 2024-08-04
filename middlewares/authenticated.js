
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const {dataNotExit} = require('../controllers/errorsControllers')

const authenticated = async (req, res,next) => {
  
  // 1) Get Token and verify it
  const token  = await  req.headers.authorization.split(' ')[1];
  const {data:userId} =  jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  // 2) get user By Id 
  const user = await User.findById(userId);

  // 3) Check if user is exist
  if (!user) {
    return dataNotExit(res,404,'User not found')
  }

  // 4) Check the user is admin or not 
  const {role} =  user;
  if (role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not admin'
    });
  } else {
    next();
  }
}

module.exports = {
  authenticated
}