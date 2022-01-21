const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware,upload } = require('../../common-middleware');
const { createBanner, updatebanner, deletebannerById, listBanner } = require('../../controller/admin/banner');


router.post('/admin/banner/create',requireSignin,adminMiddleware,upload.single('banner_image'),createBanner);

router.put('/admin/banner/update/:id',requireSignin,adminMiddleware,upload.single('banner_image'),updatebanner);
router.delete('/admin/banner/delete/:id',requireSignin,adminMiddleware,deletebannerById);
router.get('/admin/banner',requireSignin,adminMiddleware,listBanner);
router.get('/banner',listBanner);

module.exports = router;