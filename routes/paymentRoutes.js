const express = require('express');

const router = express.Router();

const paymentControllers = require('../controllers/paymentControllers');

router.post('/checkout', paymentControllers.checkoutOrder);

module.exports = router;
