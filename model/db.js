const mongoose = require('mongoose');
const MONGO_URL = 'mongodb+srv://atlas_:admin321@node0.hwbxi.mongodb.net/PointPay?retryWrites=true&w=majority'


const connect = async () => {
    try {
        //connect to db cloud
        const con = await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Mongo connect')
    } catch (err) {
        console.log('no connection')
        console.log(err);
        process.exit(1);
    }
}



module.exports = connect