const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AllProducts = require('../models/allProductsModel');
const PopularProduct = require('../models/popularProductsModel');
const dynamicProductType = require('../utils/dynamicProductType');
// const checkoutOrder = async (productId, quantity) => {
const checkoutOrder = async (req, res, productId, quantity) => {
  try {
    // 1) Identify Product Type
    const type = await dynamicProductType(productId);
    if (type === 'AllProduct') {
      product = await AllProducts.findById(productId);
    } else {
      product = await PopularProduct.findById(productId);
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount:
              +product.price.replace(/\$/g, '') * product.quantity * 100, // Convert to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/restaurant-app/paymentSuccess`,
      // success_url: `${protocol}://localhost:3000/restaurant-app/paymentSuccess`,
      cancel_url: `http://localhost:3000/restaurant-app/paymentFailed`,
    });

    return session;
  } catch (err) {
    return err;
  }
};

module.exports = { checkoutOrder };
