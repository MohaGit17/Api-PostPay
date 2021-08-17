const mongoose = require('mongoose')

const transSchema = mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    spending: {
        type: String,
        required: true
    },
    cdate: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('trans', transSchema)