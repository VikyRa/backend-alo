const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware,upload } = require('../../common-middleware');
const { createService, updateservice, deleteserviceById, getServiceDetailsById, getservice,getServiceDetailsByservice } = require('../../controller/admin/service/list');
const { validateRequestService } = require('../../validators/auth');

router.post('/admin/service/create',requireSignin,adminMiddleware,upload.single('service_image'),createService);

router.put('/admin/service/update/:id',requireSignin,adminMiddleware,upload.single('service_image'),updateservice);
router.delete('/admin/service/delete/:id',requireSignin,adminMiddleware,deleteserviceById);
router.get('/admin/service/:id',requireSignin,adminMiddleware,getServiceDetailsById);
router.get('/admin/service',requireSignin,adminMiddleware,getservice);
router.get('/service/:service',getServiceDetailsByservice)

module.exports = router;