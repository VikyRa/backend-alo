const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
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
}, { timestamps: true });

module.exports = mongoose.model('BlogCategory', blogCategorySchema);