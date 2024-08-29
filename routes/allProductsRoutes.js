const express = require('express');
const router = express.Router({});

const allProductsControllers = require('../controllers/allProductsControllers');
const { authenticated } = require('../middlewares/authenticated');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/', allProductsControllers.getAllProducts);
router.post(
  '/addProduct',
  verifyToken,
  authenticated,
  allProductsControllers.addProduct
);
router.patch(
  '/updateProduct/:productId',
  verifyToken,
  authenticated,
  allProductsControllers.updateProduct
);
router.get(
  '/:productId',
  verifyToken,
  authenticated,
  allProductsControllers.getSingleProduct
);
router.delete(
  '/:productId',
  verifyToken,
  authenticated,
  allProductsControllers.deleteProduct
);

module.exports = router;
