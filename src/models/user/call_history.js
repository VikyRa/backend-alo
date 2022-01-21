const mongoose = require('mongoose');



const CallhistorySchema = new mongoose.Schema({
    userId: {
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    },
    astronomerId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Astrologer'
     },
    date:{
        type:Date,
        required:true
    },
    start_time:{
        type:String,
        required:true,
        trim:true
    },
    end_time:{
        type:String,
        trim:true
    },
    total_time:{
        type:String,
        trim:true
    },
}, { timestamps: true });


module.exports = mongoose.model('Callhistory', CallhistorySchema);