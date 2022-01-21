const Blog  = require('../../../models/admin/blog/blog');
const fs = require('fs');
const path = require('path');
const slug = require('slug');


// GET LIST FOR BLOG
exports.listBlogController = async (req,res)=>{
    await Blog.find({}).populate("category")
    .then(blog => {
        res.status(200).json({blog});
    }).catch(err => {
        res.status(400).send({ err });
    });
}


// GET SINGLE RECORDS
exports.getSigleRecordController = async (req,res) => {
    await Blog.findById(req.params.id).populate("category")
    .then(blog => {
        res.status(200).json({blog});
    }).catch(err => {
        res.status(400).send({ err });
    }); 
}


// GET SINGLE RECORDS
exports.getSigleslugRecordController = async (req,res) => {
    await Blog.findOne({slug:req.params.slug}).populate("category")
    .then(blog => {
        res.status(200).json({blog});
    }).catch(err => {
        res.status(400).send({ err });
    }); 
}


// get count count
exports.getBlogCount= async (req,res)=>{
    await Blog.find().
    then((result)=>{
        res.status(200).json({blog:result.length});
    }).catch((err)=>{
        res.status(400).send({ err });
    });
}


// CREATE BLOG 
exports.createBlog =  (req , res) => {
    if(req.body.title ==='' || req.body.title === undefined || req.body.title === null){
        return res.status(400).json({
            message: "Blog Name is required"
        });
    }else if(req.body.short_content ==='' || req.body.short_content === undefined || req.body.short_content === null){
        return res.status(400).json({
            message: "Short Description is required"
        });
    }else if(req.body.description ==='' || req.body.description === undefined || req.body.description === null){
        return res.status(400).json({
            message: "Description is required"
        });
    }else if(req.body.category ==='' || req.body.category === undefined || req.body.category === null){
        return res.status(400).json({
            message: "Category is required"
        });
    }else{
        const blogObj = {
            title: req.body.title,
            slug:slug(req.body.title),
            short_content:req.body.short_content,
            description:req.body.description,
            category:req.body.category,
            createdBy: req.user._id,
        };

        if (req.file) {
            blogObj.thumbnail = "/public/" + req.file.filename;
        }
        
        const _blog =  new Blog(blogObj);
            _blog.save()
            .then(blog => {
                res.status(201).json({ blog });
            }).catch(err => {
                res.status(400).send({err});
            });
    }

}


// UPDATE BLOG 
exports.updateblog = async (req , res) =>{
    if(req.body.title ==='' || req.body.title === undefined || req.body.title === null){
        return res.status(400).json({
            message: "Blog Name is required"
        });
    }else if(req.body.short_content ==='' || req.body.short_content === undefined || req.body.short_content === null){
        return res.status(400).json({
            message: "Short Description is required"
        });
    }else if(req.body.description ==='' || req.body.description === undefined || req.body.description === null){
        return res.status(400).json({
            message: "Description is required"
        });
    }else if(req.body.category ==='' || req.body.category === undefined || req.body.category === null){
        return res.status(400).json({
            message: "Category is required"
        });
    }else{
        const blogObj = {
            title: req.body.title,
            slug:slug(req.body.title),
            short_content:req.body.short_content,
            description:req.body.description,
            category:req.body.category,
            createdBy: req.user._id,
        };

        if (req.file) {
            blogObj.thumbnail = "/public/" + req.file.filename;
        }
        
      const _id = req.params.id;
        await Blog.findOneAndUpdate({ _id }, { $set: blogObj }, {
            new: true,
        }).then(blog => {
                res.status(201).json({ message:"Blog updated successfully",blog });
        }).catch(err => {
                res.status(400).send({err});
        });
    }
}


// DELETE BLOG RECORDS
exports.deleteblog = async (req, res) => {
    try {
        const blogId = req.params.id;
        if (blogId) {
            await Blog.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Blog deleted successfully" });
        } else {
            return res.status(400).json({ error: "Params required" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};