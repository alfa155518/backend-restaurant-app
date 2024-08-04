const AllProducts = require('../models/allProductsModel');
const errorsControllers = require('../controllers/errorsControllers');

const addProduct = async (req, res) => {
  try {
    // 1) check product name is not duplicated
    const duplicateProduct = await AllProducts.findOne({ name: req.body.name });
    if (duplicateProduct) {
      return errorsControllers.duplicateName(res);
    }

    // 2) Create a new product
    const newProduct = await AllProducts.create(req.body);

    res.status(201).json({
      status: 'success',
      newProduct,
    });
  } catch (error) {
    // Handle specific errors
    if (error.message.includes('validation failed')) {
      return errorsControllers.validationFailed(res, 400, error);
    } else {
      return errorsControllers.globalErrorHandler(res, 400, error);
    }
  }
};

const updateProduct = async (req, res) => {
  try {
    // 1) Check all failed is full
    if ((req.body.name || req.body.description || req.body.price) === '') {
      return errorsControllers.emptyFailed(res);
    }
    // 2) Update Product
    const product = await AllProducts.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    // 2) Send Response
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await AllProducts.find();
    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await AllProducts.findById(req.params.productId);
    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    // Check if the product exit
    const product = await AllProducts.findById(req.params.productId);
    if (!product) {
      return errorsControllers.dataNotExit(res, 404, err);
    }

    // Delete the product from the database
    await AllProducts.findByIdAndDelete(req.params.productId);
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};
module.exports = {
  addProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
};
