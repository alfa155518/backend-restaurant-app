const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authControllers');
const userActions = require('../controllers/userControllers');
const { verifyToken } = require('../middlewares/verifyToken');
const { uploadImg } = require('../middlewares/uploadPhoto');
const { authenticated } = require('../middlewares/authenticated');

// User Auth
router.post('/signup', uploadImg, authControllers.signup);

router.post('/login', verifyToken, authControllers.login);

router.patch('/updatePassword', verifyToken, authControllers.updatePassword);

router.delete('/logout', verifyToken, authControllers.logout);

// User Actions
router.delete('/', verifyToken, userActions.deleteUserById);

router.patch('/updateUser', verifyToken, userActions.updateUserName);

router.get('/:userId', verifyToken, userActions.getSingleUser);

router.patch(
  '/updateUserPhoto',
  verifyToken,
  uploadImg,
  userActions.updateUserPhoto
);

module.exports = router;
