const mongoose = require('mongoose');



const WallateAmountSchema = new mongoose.Schema({
    userId: {
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    },
    order_id:{
        type:String,
        trim:true
    },
    currency:{
        type:String,
        trim:true
    },
    payment_status:{
        type:String,
        trim:true,
        default:'pending'
    },
    receipt:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    name:{
        type:String,
        trim:true
    },
    mobile:{
        type:String,
        trim:true
    },
    razarpayid:{
        type:String,
        trim:true
    },
    amount:{
        type:String,
        required:true,
        trim:true
    },
    transaction_date:{
        type:String,
    },
    all_data:{
        type:Array,
        default:[]
    },
}, { timestamps: true });



module.exports = mongoose.model('Wallateamount', WallateAmountSchema);