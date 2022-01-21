const mongoose = require('mongoose');
const saltRounds = 10;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pendingContactsSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'userId is required in pending contacts']
  },
  type: {
      type: String,
      enum: ['sent', 'received'],
      required: [true, 'type is required in pending requestsF']
  }
}, { _id: false });

const astrologerSchema = new mongoose.Schema({
  astrofirst_name: {
    type: String,
    trim: true,
    min: 3,
    max: 30
  },
  astrolast_name: {
    type: String,
    trim: true,
    min: 3,
    max: 30

  },
  astro_email: {
    type: String,
    trim: true,
    unique: true,
  },
  price: {
    type: String,
    trim: true,
  },
  astro_password: {
    type: String,
    trim: true,
  },
  astro_mobile: {
    type: Number,
    min: 10,
    unique: true,
  },
  alt_mobile: {
    type: Number,
    default: '1'
  },

  astro_gender: {
    type: String,
    default: 'male'
  },
  astrologer_slug: {
    type: String
  },
  per_hours_charge: {
    type: Number
  },
  astro_profilePicture: {
    type: String
  },
  dob: {
    type: Date
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
    default: '0'
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
  role: {
    type: String,
    default: 'astrologer'
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
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  isOnline: {
    type: Boolean,
    default: false
},
contacts: [mongoose.Schema.Types.ObjectId],
blocked: [mongoose.Schema.Types.ObjectId],
fav: [mongoose.Schema.Types.ObjectId],
pendingContacts: [pendingContactsSchema],
    lastSeen: String,
    chatList: [{

    }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });


astrologerSchema.pre("save", async function (next) {
  if (!this.isModified("astro_password")) {
    next();
  }

  this.astro_password = await bcrypt.hash(this.astro_password, 10);
});

// JWT TOKEN
astrologerSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SCRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

astrologerSchema.methods.comparePassword = async function (astro_password) {
  return await bcrypt.compare(astro_password, this.astro_password);
};


// Generating Password Reset Token
astrologerSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to astrologerSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Astrologer', astrologerSchema);