const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose')
// mongoose.set("useNewUrlParser", true)
// mongoose.set("useUnifiedTopology", true)
// mongoose.set("useFindAndModify", false)
// mongoose.set("useUnifiedTopology", true)

class Database {

    constructor() {
        this.connect()
    }

    connect() {


            
        mongoose.connect('mongodb+srv://gurudevweb:gurudevweb@gurudevweb.pgz0y.mongodb.net/gurudevweb?retryWrites=true&w=majority', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => console.log('Connected Successfully'))
        .catch((err) => console.error(`Not Connected ${err}`));
    }
}

module.exports = new Database()