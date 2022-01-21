const mongoose = require('mongoose');

const websettingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,

    },
    image:{
        type:String,
    },
    address:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    phone_two:{
        type:String
    },
    googlemap:{
        type:String
    },
    contenttype:{
        type:String,
       },
    status:{
        type: String,
        enum: ['1', '2'],
        default: '1'
        
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin',
    }
},{timestamps:true});

module.exports = mongoose.model('Websetting',websettingSchema);