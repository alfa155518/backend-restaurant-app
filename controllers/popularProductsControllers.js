const PopularProducts = require('../models/popularProductsModel');


const popularProducts = async (req,res) => {
  try {
    const popularProducts = await PopularProducts.find();
    res.status(200).json({
      status:'success',
      popularProducts
    })
  } catch (err) {
    return errorsControllers.globalErrorHandler(res,400,err)
  }
}

module.exports = {
  popularProducts,
}