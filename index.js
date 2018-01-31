const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.use(express.static('build'))

let persons = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Martti Tienari', number: '040-123456', id: 2 },
  { name: 'Arto Järvinen', number: '040-123456', id: 3 },
  { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
]

app.get('/info', (req, res) => {
  res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
  <p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const getRandomInt = () => {
  return Math.floor(Math.random() * Math.floor(60000));
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'Name is missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'Number is missing' })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'Person exists already' })
  }


  const person = {
    name: body.name,
    number: body.number,
    id: getRandomInt()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  const updatedPerson = persons.find((person) => person.id === id);
  updatedPerson.number = body.number;

  persons = persons.filter((person) => person.id !== id);
  persons = persons.concat(updatedPerson);

  response.json(updatedPerson);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
