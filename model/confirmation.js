const mongoose = require('mongoose')
var Schema = mongoose.Schema;


const confirmSchema = mongoose.Schema({
    mail: {
        type: String,
        required: true
    },
    confirm_code:{
        type: Number,
        required : true
    }
   
})

module.exports = mongoose.model('confirmation', confirmSchema)