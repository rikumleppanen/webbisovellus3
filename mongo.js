const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla!
const url = 'mongodb://admin:pluettelo@ds219318.mlab.com:19318/pluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] && process.argv[3]) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    person
        .save()
        .then(response => {
            console.log("Lisätään henkilö "+person.name+" numero " +person.number+" luetteloon")
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log(`Puhelinluettelo:`)
            result.forEach(person => {
                console.log(person.name + " " + person.number)
            })
            mongoose.connection.close()
        })
}




