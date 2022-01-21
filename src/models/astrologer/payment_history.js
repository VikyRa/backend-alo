const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const astrologerPaymentSchema = new mongoose.Schema({
    plan_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plan'
    },
    astrologer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Astrologer'

    },
    amount:{
        type:String,
    },
    payment_number:{
        type:String,
    },
    payment_status:{
        type:String,
    },
    payment_date:{
        type:String,
    },
    payment_all_data:{
        type:String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Astrologerpaymenthist',astrologerPaymentSchema);