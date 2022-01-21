const mongoose = require('mongoose');
// mongodb://localhost:27017/alo
// mongodb+srv://gurudevweb:gurudevweb@gurudevweb.pgz0y.mongodb.net/gurudevweb?retryWrites=true&w=majority
const db = mongoose.connect('mongodb+srv://gurudevweb:gurudevweb@gurudevweb.pgz0y.mongodb.net/gurudevweb?retryWrites=true&w=majority', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected Successfully'))
    .catch((err) => console.error(`Not Connected ${err}`));

module.exports = db;