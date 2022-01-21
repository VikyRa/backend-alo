const Category = require('../../../models/admin/product/category');

// GET LIST FOR PRODUCT CATEGORY
exports.catlist = async (req, res) => {
    await Category.find({}).then(category => {
        res.status(200).json({ category });
    }).catch(err => {
        res.status(400).send({ err });
    });
}


// CREATE PRODUCT CATEGORY
exports.createcat = (req, res) => {
    if (req.body.name === '' || req.body.name === undefined || req.body.name === null) {
        return res.status(400).json({
            message: "Category Name is required"
        });
    } else {
        const catObj = {
            name: req.body.name,
        };
        Category.findOne({ name: req.body.name }).exec((error, user) => {
            if (user) return res.status(400).json({
                message: "Category already registered"
            });
            const _cat = new Category(catObj);
            _cat.save()
                .then(cat => {
                    res.status(201).json({ cat });
                }).catch(err => {
                    res.status(400).send({ err });
                });
        });
    }
}



// UPDATE BLOG 
exports.updatecat = async (req , res) =>{
    if (req.body.name === '' || req.body.name === undefined || req.body.name === null) {
        return res.status(400).json({
            message: "Category Name is required"
        });
    }else{
        const catObj = {
            name: req.body.name,
        };
        
      const _id = req.params.id;
        await Category.findOneAndUpdate({ _id }, { $set: catObj }, {
            new: true,
        }).then(category => {
                res.status(201).json({ message:"Category updated successfully",category });
        }).catch(err => {
                res.status(400).send({err});
        });
    }
}


// DELETE BLOG RECORDS
exports.deletecat = async (req, res) => {
    try {
        const blogId = req.params.id;
        if (blogId) {
            await Category.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Category deleted successfully" });
        } else {
            return res.status(400).json({ error: "Params required" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
}



// GET SINGLE RECORDS
exports.getSigleRecord = async (req,res) => {
    await Category.findById(req.params.id)
    .then(cat => {
        res.status(200).json({cat});
    }).catch(err => {
        res.status(400).send({ err });
    }); 
}