const mongoose = require('mongoose');



const ReviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type: String,
        enum: ['1', '2'],
        default: '1'
    }
}, { timestamps: true });



module.exports = mongoose.model('Review', ReviewSchema);