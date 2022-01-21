const BlogCategory = require('../../../models/admin/blog/category');
const slug = require('slug');

exports.listblogCategory = async (req, res) => {
    try {
        const category = await BlogCategory.find({});
        return res.status(200).json({ category });
    } catch (err) {
        return res.status(401).json({ message: 'some thing went worng !', error: err });
    }
}



exports.createblogCategory = (req, res) => {
    if(req.body.cat_name ==='' || req.body.cat_name === undefined){
        return res.status(400).send({ message:"Category name is required" });
    }else if(req.body.status ==='' || req.body.status === undefined){
        return res.status(400).send({ message:"Status is required" });
    }else{
        const bannerObj = {
            name: req.body.cat_name,
            slug:slug(req.body.cat_name),
            status:req.body.status,
            createdBy: req.user._id,
        };
        BlogCategory.findOne({ name: req.body.cat_name }).exec((error, user) => {
            if (user) return res.status(400).json({
                message: "Blog Category already registered"
            });
        const _banner = new BlogCategory(bannerObj);
        _banner.save()
            .then(item => {
                res.status(201).json({ item });
            }).catch(err => {
                res.status(400).send({ err });
            });
        });
    }
}



exports.updateblogCategory = async (req, res) => {        
    if(req.body.cat_name ==='' || req.body.cat_name === undefined){
        return res.status(400).send({ message:"Category name is required" });
    }else if(req.body.status ==='' || req.body.status === undefined){
        return res.status(400).send({ message:"Status is required" });
    }else{
            const bannerObj = {
                name: req.body.cat_name,
                slug:slug(req.body.cat_name),
                status:req.body.status,
                createdBy: req.user._id,
            };
        
            const _id = req.params.id;
            await BlogCategory.findOneAndUpdate({ _id }, { $set: bannerObj }, {
                new: true,
            }).then(category => {
                res.status(200).json({ category });
            }).catch(err => {
                res.status(400).send({ err });
            });
    }
}


// new update
exports.deleteblogCategory = async (req, res) => {
    try {
        const bannerId = req.params.id;
        if (bannerId) {
            await BlogCategory.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Blog category delete successfully" });
        } else {
            return res.status(400).json({ error: "Params required" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};



// get single blog category
exports.singleblogCategory = async (req,res)=>{
     await BlogCategory.findById(req.params.id)
        .then(blogCat => {
            res.status(200).json({blogCat});
        }).catch(err => {
            res.status(400).send({ err });
        });  
}
