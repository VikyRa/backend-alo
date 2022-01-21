const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        youtubeurl: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true
        },
        description: {
            type: String
        },
        price: {
            type: String,
            trim: true,
        },
        oldprice: {
            type: String,
            trim: true,
            default:0
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        quantity: {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        thumbimage :{ type: String },
        productPictures: { type: String }, 
        reviews: [
            {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
              },
              name: {
                type: String,
                required: true,
              },
              rating: {
                type: Number,
                required: true,
              },
              comment: {
                type: String,
                required: true,
              },
            },
          ],
          numOfReviews: {
            type: Number,
            default: 0,
          },
          ratings: {
            type: Number,
            default: 0,
          },
         createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },  
        status:{
          type: String,
          enum: ['1', '2'],
          default: '1'
      },
    }, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
