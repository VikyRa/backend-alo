const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware,upload } = require('../../../common-middleware');
const { createcat, updatecat, deletecat, getSigleRecord, catlist } = require('../../../controller/admin/product/category');



router.post('/admin/product-category/create',requireSignin,adminMiddleware,createcat);
router.put('/admin/product-category/update/:id',requireSignin,adminMiddleware,updatecat);
router.delete('/admin/product-category/delete/:id',requireSignin,adminMiddleware,deletecat);
router.get('/admin/product-category/:id',requireSignin,adminMiddleware,getSigleRecord);
router.get('/admin/product-category',requireSignin,adminMiddleware,catlist);

module.exports = router;