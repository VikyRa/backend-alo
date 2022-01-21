const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({

    service_name:{
        type:String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    service_image:{
        type:String,
        required:true,
        trim:true
    },
    short_description:{
        type:String,
        required:true,
        trim:true
    },
    long_description:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type: String,
        enum: ['1', '2'],
        default: '1'
    },
    is_paid:{
        type: String,
        enum: ['paid', 'free']
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin',
    }
},{ timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);