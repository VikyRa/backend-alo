const express = require("express");
const { getSigleslugRecordController } = require("../../controller/admin/blog/blogController");
const { listblogCategory } = require("../../controller/admin/blog/categoryController");
const { getBlogList, blogList } = require("../../controller/web/home");
const router = express.Router();


router.get('/homeblog',getBlogList);
router.get('/blogslist',blogList);
router.get('/blog/:slug',getSigleslugRecordController);
router.get('/blog-category',listblogCategory);


module.exports = router;