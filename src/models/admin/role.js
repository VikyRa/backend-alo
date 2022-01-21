const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_name:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type: String,
        enum: ['1', '2'],
        default: '1'
        
    }
},{timestamps:true});

module.exports = mongoose.model('Role',roleSchema);