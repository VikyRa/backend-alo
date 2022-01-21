const mongoose = require('mongoose');



const UserpassbookSchema = new mongoose.Schema({
    userId: {
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    },
    amount:{
        type:String,
        required:true,
        trim:true
    },
    transaction_date:{
        type:Date,
        required:true
    },
    transaction_type:{
        type: String,
        enum: ['1=credit', '2=debit'],
    },
    transaction_number:{
        type:String,
        required:true,
        trim:true
    },
    transaction_status:{
        type:String
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


module.exports = mongoose.model('Userpassbook', UserpassbookSchema);