const express = require('express');
const router = express.Router();
const employeesControllers = require('../controllers/employeesControllers');
const { authenticated } = require('../middlewares/authenticated');
const { verifyToken } = require('../middlewares/verifyToken');
const { uploadImg } = require('../middlewares/uploadPhoto');

router.post(
  '/addEmployee',
  verifyToken,
  authenticated,
  uploadImg,
  employeesControllers.addEmployee
);
router.get(
  '/employee/:employeeId',
  verifyToken,
  authenticated,
  employeesControllers.getSingleEmployee
);
router.patch(
  '/employee/:employeeId',
  verifyToken,
  authenticated,
  employeesControllers.updateSingleEmployee
);
router.get(
  '/',
  verifyToken,
  authenticated,
  employeesControllers.getAllEmployees
);
router.delete(
  '/employee/:employeeId',
  verifyToken,
  authenticated,
  employeesControllers.deleteEmployee
);

module.exports = router;
