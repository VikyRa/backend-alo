const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId, ref: "User"
    }],
    latestMessage: {
        type: Schema.Types.ObjectId, ref: "Message"
    },
    total_time:{
        type:String,
        default:'0'
    },
    is_accept:{
        type:String,
        default:'0'
    },
    is_complete:{
        type:String,
        enum:['0','1'],
        default:'0'
    },
    start_time:{
        type:String
    },
    end_time:{
        type:String
    },
    is_first_dedecat:{
        type:String,
        enum:['0','1'],
        default:'0'
    },
    per_minute_charge:{
        type:String,
        default:'0'
    },
    userId:{
        type: Schema.Types.ObjectId, ref: "User"
    },
    astrologerId:{
        type: Schema.Types.ObjectId, ref: "User"
    }
}, { timestamps: true })

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;