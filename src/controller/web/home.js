const Product = require('../../models/admin/product/product');
const Blog = require('../../models/admin/blog/blog');
const fs = require('fs');
const path = require('path');
const slug = require('slug');
const ApiFeatures = require('../../utiles/apifeatures');
const catchAsyncErrors = require('../../common-middleware/catchAsyncErrors');
const BlogApi = require('../../utiles/apiblog');


// get limited record
exports.getallproduct =  catchAsyncErrors(async (req, res, next) => {
    await Product.find().limit(8)
    .then(mall => {
        res.status(200).json({ mall });
    }).catch(err => {
        res.status(400).send({ err });
    });
});


// GET BLOG 
exports.getBlogList =  catchAsyncErrors(async (req, res, next) => {
    await Blog.find().sort({_id:-1}).limit(3)
    .then(blog => {
        res.status(200).json({ blog });
    }).catch(err => {
        res.status(400).send({ err });
    });
});



exports.blogList = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 10;
    const blogsCount = await Blog.countDocuments();
  
    const apiFeature = new BlogApi(Blog.find().sort({_id:-1}).populate("category"), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
  
    let filteredblogsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    let blogs = await apiFeature.query;
  
    res.status(200).json({
      success: true,
      blogs,
      blogsCount,
      resultPerPage,
      filteredblogsCount,
    });
  });