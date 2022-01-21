const Websetting = require('../../../models/admin/websetting');

const catchAsyncErrors = require('../../../common-middleware/catchAsyncErrors');
const ErrorHander = require('../../../utiles/errorhander');


// get logged in user  Orders
exports.getallSetting = catchAsyncErrors(async (req, res, next) => {
    await Websetting.find()
    .then((websettings) => {
        return res.status(200).json({
            websettings,
        });
    }).catch((error) => {
        return res.status(400).json({
            error
        });
    });
});

// get setting find by id
exports.getIdSetting = catchAsyncErrors(async (req, res, next) => {
    const _id =req.params.id;
    await Websetting.findById({_id})
        .then((websettings) => {
            return res.status(200).json({
                websettings,
            });
        }).catch((error) => {
            return res.status(400).json({
                error
            });
        });
});

exports.getFindBytype = catchAsyncErrors(async (req, res, next) => {
    await Websetting.findOne({ contenttype: req.params.type })
        .then((websettings) => {
            return res.status(200).json({
                websettings,
            });
        }).catch((error) => {
            return res.status(400).json({
                error
            });
        });
});


// CREATE BLOG 
exports.createWebsetting = (req, res) => {

    if (req.body.title === '' || req.body.title === undefined || req.body.title === null) {
        return res.status(400).json({
            message: "Title is required"
        });
    } else {
        // let productPictures = [];
        // if (req.files.length > 0) {
        //     productPictures = req.files.map((file) => {
        //         return { img: file.location };
        //     });
        // }

        const blogObj = {
            title: req.body.title,
            content: req.body.content,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            phone_two: req.body.phone_two,
            googlemap: req.body.googlemap,
            contenttype: req.body.contenttype,
            createdBy: req.user._id,
            status: req.body.status
        };

        if (req.file) {
            blogObj.image = "/public/" + req.file.filename;
        }
        // if (req.file) {
        //     blogObj.thumbimage = "/public/" + req.file.filename;
        // }


        Websetting.findOne({ contenttype: req.body.contenttype }).exec((error, user) => {
            if (user) return res.status(400).json({
                message: "Information already registered"
            });
            const _product = new Websetting(blogObj);
            _product.save()
                .then(websettings => {
                    return res.status(201).json({ websettings });
                }).catch(err => {
                    return res.status(400).send({ err });
                });
        });
    }

}

exports.updateWebsetting = async (req, res) => {

    if (req.body.title === '' || req.body.title === undefined || req.body.title === null) {
        return res.status(400).json({
            message: "Title is required"
        });
    } else {
        // let productPictures = [];
        // if (req.files.length > 0) {
        //     productPictures = req.files.map((file) => {
        //         return { img: file.location };
        //     });
        // }

        const blogObj = {
            title: req.body.title,
            content: req.body.content,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            phone_two: req.body.phone_two,
            googlemap: req.body.googlemap,
            createdBy: req.user._id,
            status: req.body.status
        };
         // contenttype: req.body.contenttype,

        if (req.file) {
            blogObj.image = "/public/" + req.file.filename;
        }
        // if (req.file) {
        //     blogObj.thumbimage = "/public/" + req.file.filename;
        // }


        const _id = req.params.id;
        await Websetting.findOneAndUpdate({ _id }, { $set: blogObj }, {
            new: true,
        }).then(websettings => {
            return res.status(200).json({ websettings });
        }).catch(err => {
            return res.status(400).send({ err });
        });

    }

}


// DELETE SETTING RECORDS
exports.deleteSetting = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            await Websetting.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Setting deleted successfully" });
        } else {
            return res.status(400).json({ error: "Params required" });
        }
    } catch (err) {
        res.status(400).json({ error:err });
    }
};
