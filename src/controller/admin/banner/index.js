const Banner = require('../../../models/admin/banner');


exports.listBanner = async (req,res) => {
    try{
        const banner = await Banner.find({});
        return res.status(200).json({banner});
    }catch(err){
        return res.status(401).json({message:'some thing went worng !',error:err});
    }
}



exports.createBanner =  (req,res) => {
            const bannerObj = {
                banner_link: req.body.banner_link,
                createdBy: req.user._id,
            };
            if (req.file) {
                bannerObj.banner_image = "/public/" + req.file.filename;
               
            }
            const _banner =  new Banner(bannerObj);
            _banner.save()
                .then(item => {
                    res.status(201).json({ item });
                }).catch(err => {
                    res.status(400).send({err});
                });

}



exports.updatebanner = async (req, res) => {
    try {
        const bannerObj = {
            banner_link: req.body.banner_link,
            createdBy: req.user._id,
        };
        if (req.file) {
            // path.join(path.dirname(__dirname)
            bannerObj.banner_image = "/public/" + req.file.filename;
        }
        bannerObj.createdBy=req.user._id
        const _id = req.params.id;
        const updatedbanner = await Banner.findOneAndUpdate({ _id }, { $set:bannerObj }, {
            new: true,
          }).then(item => {
            res.status(200).json({ item });
        }).catch(err => {
            res.status(400).send({err});
        });;
        //   return res.status(200).json({ updatedbanner });
    } catch (err) {
        res.status(400).json({ err });
    }
}


// new update
exports.deletebannerById = async (req, res) => {
    try {
        const bannerId = req.params.id;
        if (bannerId) {
            await  Banner.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message:"Banner delete successfully" });
        } else {
            return res.status(400).json({ error: "Params required" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};
