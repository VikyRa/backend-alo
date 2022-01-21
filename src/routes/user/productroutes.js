const express = require('express');
const { isAuthenticatedUser } = require('../../common-middleware/auth');
const { getProducts } = require('../../controller/admin/product/product');
const { createProductReview,getProductDetails,getProductReviews,deleteReview } = require('../../controller/user/productreview');
const { getallproduct } = require('../../controller/web/home');
const router = express.Router();


router.post('/web/product', getProducts);
router.post("/review",isAuthenticatedUser, createProductReview);
router.get("/product/:id",getProductDetails);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);


router.get('/allmall',getallproduct);
module.exports = router;