const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware,upload } = require('../../../common-middleware');
const { createProduct, listProductController ,getSigleProductController, updateProduct, deleteProduct, productlenght} = require('../../../controller/admin/product/product');


router.post('/admin/product/create',requireSignin,adminMiddleware,upload.single('productPictures'),createProduct);
router.get('/admin/product',requireSignin,adminMiddleware,listProductController);
router.get('/admin/product/:id',requireSignin,adminMiddleware,getSigleProductController);
router.put('/admin/product/update/:id',requireSignin,adminMiddleware,upload.single('productPictures'),updateProduct);
router.delete('/admin/product/delete/:id',requireSignin,adminMiddleware,deleteProduct);
router.get('/product/count',productlenght);
module.exports = router; 