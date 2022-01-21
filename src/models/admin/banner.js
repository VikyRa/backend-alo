const mongoose = require('mongoose');


const bannerSchema = new mongoose.Schema({

    banner_link:{
        type:String,
    },
    banner_image:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin',
    }
},{ timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);