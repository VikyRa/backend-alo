const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
      },
      slug:{
        type: String,
        require: true,
        trim: true,
        lowercase: true
      },
      short_content: {
        type: String,
        require: true,
      },
      description: {
        type: String,
        require: true,
        trim: true,
      },
      thumbnail:{
        type: String
      },
      
    status:{
      type: String,
      enum: ['1', '2'],
      default: '1'
  },
      category: { type: mongoose.Types.ObjectId, ref: 'BlogCategory' },
      createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Admin',
        }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);