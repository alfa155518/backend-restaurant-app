
const jwt = require('jsonwebtoken');
const errorsControllers = require('../controllers/errorsControllers')


// Middleware to verify token
const verifyToken = async(req, res, next) => {
  try {
    //1) Check if there no token  from headers
    if (!req.headers.authorization) {
      return errorsControllers.notToken(res)
  }
  
  
  //2) Check token already exit
  const token =  await req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(403).send('Token is required');
  }

  //3) Verify token
  await jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
    if (err) {
      return res.status(401).json({
        status:'fail',
        message:'expired token You must signup'
      });
    }
    next();
  });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: 'Something went wrong'
    });
  } 
};

module.exports = {
  verifyToken,
}