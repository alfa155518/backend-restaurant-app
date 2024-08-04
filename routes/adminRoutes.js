const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const { authenticated } = require('../middlewares/authenticated');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/users', verifyToken, authenticated, adminControllers.getAllUsers);

router.patch(
  '/users/update/:userId',
  verifyToken,
  authenticated,
  adminControllers.updateSingleUser
);

router.delete(
  '/users/delete/:userId',
  verifyToken,
  authenticated,
  adminControllers.deleteSingleUser
);

router.get(
  '/users/user/:userId',
  verifyToken,
  authenticated,
  adminControllers.getSingleUser
);

module.exports = router;
