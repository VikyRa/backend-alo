const express = require('express');
const { storeCallhistory, updatecallhistory } = require('../../controller/user/callhistory');
const router = express.Router();


router.post('/web/callhistory',storeCallhistory);
router.put('/web/updatecall/:id',updatecallhistory);

module.exports = router;