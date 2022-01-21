const express = require("express");
const { createContact } = require("../../controller/web/contact");
const router = express.Router();


router.post('/create-contact',createContact);

module.exports = router;