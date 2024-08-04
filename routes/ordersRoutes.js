const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/ordersControllers');
const { authenticated } = require('../middlewares/authenticated');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/addOrder', verifyToken, orderControllers.createOrder);
router.get('/', verifyToken, authenticated, orderControllers.getAllOrders);
router.patch('/:orderId', verifyToken, orderControllers.updateOrderStatus);
router.delete('/:orderId', verifyToken, orderControllers.deleteOrder);

module.exports = router;
