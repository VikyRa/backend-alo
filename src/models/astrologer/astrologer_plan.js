const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const astrologerPlanSchema = new mongoose.Schema({
    service_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service'
    },
    astrologer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Astrologer'

    },
    status:{
        type: String,
        enum: ['1', '2'],
        default: '1'
    }
}, { timestamps: true });

module.exports = mongoose.model('Astrologerplan',astrologerPlanSchema);