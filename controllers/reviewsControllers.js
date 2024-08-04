
const Reviews = require('../models/reviewsModel')
const errorsControllers = require('../controllers/errorsControllers')
const addReview =  async (req,res) => {
  try {
    const review = await Reviews.create(req.body)
    res.status(201).json({
      status:'success',
      review
    })
  } catch (err) {
    if (err.message.includes('validation failed')) {
      return errorsControllers.validationFailed(res,400,err)
    }
    else {
      return errorsControllers.globalErrorHandler(res,400,err)
    }
  }
}


const getAllReview = async (req, res) => {
  try {
    const reviews = await Reviews.find({},"-__v").populate({path:"reviewer",select:"-__v -password -role"})
    res.status(200).json({
      status:'success',
      reviewsNumber:reviews.length,
      reviews
    })
  } catch (err) {
    return errorsControllers.globalErrorHandler(res,400,err)
  }
}

module.exports = {addReview,getAllReview}