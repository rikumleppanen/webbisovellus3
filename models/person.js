const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema
var personSchema = new Schema({
    name: String,
    number: String
})
personSchema.statics.format = function (data) {
    return {
        name: data.name,
        number: data.number,
        id: data._id
    }
}
var Person = mongoose.model('Person', personSchema)

module.exports = Person