const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla!
const url = 'mongodb://admin:pluettelo@ds219318.mlab.com:19318/pluettelo'

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
var Person = mongoose.model('Person',personSchema)

module.exports = Person