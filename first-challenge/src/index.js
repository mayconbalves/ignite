const express = require('express')
const cors = require('cors')
const { v4: uuidV4 } = require('uuid')
const app = express()

app.use(express.json())
app.use(cors())

const users = []

app.post('/users', (request, response) => {
  const { name, userName } = request.body

  const fullUser = {
    id: uuidV4(),
    name,
    userName,
    todos: []
  }

  return response.status(201).json(fullUser)
})

app.listen(3333)

