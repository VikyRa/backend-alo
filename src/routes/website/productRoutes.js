const express = require("express");
const { catlist } = require("../../controller/admin/product/category");
const { getProducts, getSigleProductController } = require("../../controller/admin/product/product");
const router = express.Router();


router.get('/products',getProducts);
router.get('/product/:id',getSigleProductController);
router.get('/category',catlist)

module.exports = router;