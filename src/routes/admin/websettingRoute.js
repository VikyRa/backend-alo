const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware,upload } = require('../../common-middleware');
const { createWebsetting, updateWebsetting, getallSetting, deleteSetting, getIdSetting, getFindBytype } = require('../../controller/admin/websetting/setting');


router.post('/admin/setting/create',requireSignin,adminMiddleware,upload.single('image'),createWebsetting);
router.get('/admin/setting',requireSignin,adminMiddleware,getallSetting);
router.put('/admin/setting/update/:id',requireSignin,adminMiddleware,upload.single('image'),updateWebsetting);
router.delete('/admin/setting/delete/:id',requireSignin,adminMiddleware,deleteSetting);

router.get('/admin/setting/:id',requireSignin,adminMiddleware,getIdSetting);

router.get('/setting/:type',getFindBytype)

module.exports = router; 