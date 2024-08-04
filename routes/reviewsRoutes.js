const express =  require('express');
const router = express.Router();
const reviewsControllers = require("../controllers/reviewsControllers")
const {verifyToken} = require('../middlewares/verifyToken')

router.post("/addReview",verifyToken,reviewsControllers.addReview)
router.get("/",reviewsControllers.getAllReview)


module.exports = router;