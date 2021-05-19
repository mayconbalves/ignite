const express = require('express')
const cors = require('cors')
const { v4: uuidV4 } = require('uuid')
const app = express()

app.use(express.json())
app.use(cors())

const users = []

app.post('/users', (request, response) => {
  const { name, username } = request.body

  users.push({
    id: uuidV4(),
    name,
    username,
    todos: []
  })

  return response.status(201).json(users)
})

app.get('/todos', (request, response) => {
  const { username } = request.headers

  const userTodos = users.find((user) => user.username === username)

  return response.status(200).json(userTodos.todos)
})

app.listen(3333)

