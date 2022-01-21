const express = require('express');
const { listblogCategory, createblogCategory, updateblogCategory, deleteblogCategory, singleblogCategory } = require('../../../controller/admin/blog/categoryController');
const router = express.Router();
const { requireSignin, adminMiddleware,upload } = require('../../../common-middleware');


router.post('/admin/blog-category/create',requireSignin,adminMiddleware,createblogCategory);
router.put('/admin/blog-category/update/:id',requireSignin,adminMiddleware,updateblogCategory);
router.delete('/admin/blog-category/delete/:id',requireSignin,adminMiddleware,deleteblogCategory);
router.get('/admin/blog-category/:id',requireSignin,adminMiddleware,singleblogCategory);
router.get('/admin/blog-category',requireSignin,adminMiddleware,listblogCategory);

module.exports = router;