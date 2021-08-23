const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var typage = new Schema({
    item: String, qty: Number
});

const clientSchema = mongoose.Schema({
    mail: {
        type: String,
        required: true
    },
    date_naiss: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default:0
    },
    freind: {
        type: [String],
        default: []
    },
    Vfriend:{
        type: [String],
        default: []
    },
    TransactionsIN:{
        type: [String],
        default: []
    },
    TransactionsOUT:{
        type: [String],
        default: []
    },
    gender:{
        type: String,
        required : true
    },
    table:[typage],
    avatar:{
        type:String,
        default:'uploads\\1628618800941.png'
    },
    created_AT:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('client', clientSchema)