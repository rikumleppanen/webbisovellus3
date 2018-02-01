const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.use(express.static('build'))


const Person = require('./models/person')


app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
  <p>${Date()}</p>`)
  })

})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(one => {
      if (one) {
        response.json(Person.format(one))
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      console.log(error)
      response.status(400).send({ error: 'Malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(one => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'Malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
     return response.status(400).json({ error: 'Name is missing' })
  }
  if (!body.number) {
     return response.status(400).json({ error: 'Number is missing' })
  }


  Person.findOne({ name: body.name })
    .then(one => {
      if (one) {
        return response.status(400).json({ error: 'Name is already taken' })
      } else {
        const personObj = new Person({
          name: body.name,
          number: body.number
        })
        personObj.save()
          .then(one => {
            response.json(Person.format(one))
          }).catch(error => {
            console.log(error)
          })
      }
    })

})

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;

  const personObj = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, personObj, { new: true })
    .then(one => {
      response.json(Person.format(one))
    }).catch(error => {
      console.log(error)
      response.status(400).send({ error: 'Malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
