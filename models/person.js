const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla!
const url = 'mongodb://admin:pluettelo@ds219318.mlab.com:19318/pluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person