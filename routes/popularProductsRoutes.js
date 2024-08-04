const express = require('express');
const router = express.Router();
const popularProductsControllers = require('../controllers/popularProductsControllers')


router.get('/', popularProductsControllers.popularProducts);

module.exports = router;