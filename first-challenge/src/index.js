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

app.get('/todos', (request, response) => {
  const { username } = request.headers

  const userTodos = users.find((user) => user.username === username)

  return response.status(200).json(userTodos.todos)
})

app.post('/todos', (request, response) => {
  const { title, deadline } = request.body
  const { username } = request.headers

  const userTodos = users.find((user) => user.username === username)

  userTodos.todos.push({
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  return response.status(201).json(userTodos)
})

app.listen(3333)

