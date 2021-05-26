const express = require('express')
const cors = require('cors')
const { v4: uuidV4 } = require('uuid')
const app = express()

app.use(express.json())
app.use(cors())

const users = []

function checkExistsUser(request, response, next) {
  const { username } = request.headers

  const user = users.find((user) => user.username === username)

  if(!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userExists = users.find((user) => user.username === username)

  if (userExists) {
    return response.status(400).json({ error: 'User already exists' })
  }

  const user = {
    id: uuidV4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
})

app.get('/todos', checkExistsUser, (request, response) => {
  const { user } = request

  return response.status(200).json(user.todos)
})

app.post('/todos', checkExistsUser, (request, response) => {
  const { title, deadline } = request.body
  const { user } = headers

  const todo = {
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
})

app.put('/todos/:id', (request, response) => {
  const { title, deadline } = request.body
  const { username } = request.headers

  const userId = users.find((user) => user.username === username)
})

app.listen(3333)

