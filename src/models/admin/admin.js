const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Technique 1 (generate a salt and hash on separate function calls):
const salt = bcrypt.genSaltSync(saltRounds);
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 30
    },
    username: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    hash_password: {
        type: String,
        required: true,
        trim: true,
        min: 3,
    },
    mobile: {
        type: Number,
        required: true,
        min: 10
    },
    role:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'Role',
        type: String,
        default: 'admin'
        // required:true,
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
    }
}, { timestamps: true });

// userSchema.virtual('password').set(function(password) {
//     console.log('password');
//     this.hash_password = bcrypt.hashSync(password, salt);
// });

// userSchema.virtual("fullName").get(function() {
//     return `${this.firstname} ${this.lastname}`;
// });


// userSchema.method = {
//     authenticate: function(password) {
//         return bcrypt.compare(password, this.hash_password);
//     }
// }

userSchema.methods = {
    authenticate: async function(password) {
        return await bcrypt.compare(password, this.hash_password);
    },
};


module.exports = mongoose.model('Admin', userSchema);