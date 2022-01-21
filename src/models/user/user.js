const mongoose = require('mongoose');
const saltRounds = 10;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Technique 1 (generate a salt and hash on separate function calls):
const salt = bcrypt.genSaltSync(saltRounds);
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        min: 3,
        max: 30
    },
    last_name:{
        type:String,
        trim:true, 
        min: 3,
        max: 30

    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        select: false,
    },
    mobile: {
        type: Number,
        min: 10
    },

    // new field add start
    walletamount: {
        type: String,
        trim: true,
        default: '0'
      },

      per_hours_charge: {
        type: Number,
        default: '0'
      },
      dob: {
        type: String
      },
      problem_area: {
        type: String,
        default: '0'
      },
      primary_skills: {
        type: String,
        default: '0'
      },
      all_skills: {
        type: String,
        default: '0'
      },
      language: {
        type: String,
        default: 'Hindi'
      },
      experience: {
        type: String,
        default: '0'
      },
      contribute_hours: {
        type: Number,
        default: '1'
      },
      working_another_platform: {
        type: String,
        default: 'no',
        enum: ['yes', 'no'],
      },
      main_source_income: {
        type: String,
        default: 'Job'
      },
      suitable_time_interview: {
        type: String,
        default: '0'
      },
      onboard_queston: {
        type: String,
        default: '0'
      },
      address: {
        type: String,
        default: 'india'
      },
      city: {
        type: String,
        default: 'india'
      },
      id_proof: {
        type: String,
        default: 'profile.jpg'
      },
      adhar_card: {
        type: String,
        default: 'profile.jpg'
      },
      pancard: {
        type: String,
        default: 'profile.jpg'
      },
      long_bio: {
        type: String,
        default: 'Enter Bio'
      },
      contact_person_name: {
        type: String,
        default: 'test'
      },
      contact_person_mobile: {
        type: String,
        default: '999999999'
      },
      astro_status: {
        type: String,
        enum: ['1', '2','3'],
        default: '1'
      },
     
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

      slug:{
        type:String
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      ratings: {
        type: Number,
        default: 0,
      },

    // new field add end
    
    gender:{
        type:String,
    },
    date_of_birth:{
        type: Date
    },
    birth_time:{
        type:String
    },
    birth_place:{
        type:String
    },
    profilePicture: {
        type: String
    },
    status:{
        type: String,
        enum: ['1', '2'],
        default: '1'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin',
    },
    role:{
        type:String,
        default:'user'
    },
    alt_mobile: {
        type: Number,
        default: '1'
      },
      isactive:{
        type: Number,
        default: '0'
      },
      is_mobile_varify:{
        type: Number,
        default: '0'
      },
      is_email_varify:{
        type: Number,
        default: '0'
      },
      mobileotp:{
        type:String,
      },
      is_online:{
        type: String,
        enum: ['1', '0'],
        default: '0'
      },
    
     resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  // JWT TOKEN
  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SCRETE, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
  
  // Compare Password
  
  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };


module.exports = mongoose.model('User', userSchema);