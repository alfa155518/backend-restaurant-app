const express = require('express');
const router = express.Router();

const contactControllers = require('../controllers/contactControllers');
const { verifyToken } = require('../middlewares/verifyToken');
const { authenticated } = require('../middlewares/authenticated');

router.post('/', verifyToken, contactControllers.contactUs);
router.get(
  '/',
  verifyToken,
  authenticated,
  contactControllers.getAllContactMessage
);
router.delete(
  '/:messageId',
  verifyToken,
  authenticated,
  contactControllers.deleteContactMessage
);

module.exports = router;
