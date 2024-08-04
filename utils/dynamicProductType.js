const AllProducts = require('../models/allProductsModel');
const PopularProduct = require('../models/popularProductsModel');

const dynamicProductType = async (productId) => {
  const product = await AllProducts.findById(productId);

  if (product) {
    return 'AllProduct';
  }

  const popularProduct = await PopularProduct.findById(productId);

  if (popularProduct) {
    return 'popularProduct';
  }
};

module.exports = dynamicProductType;
