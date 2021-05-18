const { response, request } = require('express')
const express = require('express')
const { v4: uuidV4 } = require('uuid')

const app = express()
app.use(express.json())

const customer = []

function verifyExistsAccountCpf(request, response, next) {
  const { cpf } = request.headers

  const costumer = customer.find(costumer => costumer.cpf === cpf)
  if (!costumer) {
    return response.status(400).json({ error: 'Costumer not found' })
  }

  request.customer = costumer
  return next()
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.ammount
    } else {
      return acc - operation.ammount
    }
  }, 0)

  return balance
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body

  const customerAlreadyExiste = customer.some(
    customer => customer.cpf === cpf
  )

  if(customerAlreadyExiste) {
    return response.status(400).json({ error: 'customer already existe' })
  }

  customer.push({
    cpf,
    name,
    id: uuidV4(),
    statement: []
  })

  return response.status(201).send()
})

app.get('/statement', verifyExistsAccountCpf, (request, response) => {
  const { customer } = request
  return response.json(customer.statement)
})

app.post('/deposit', verifyExistsAccountCpf, (request, response) => {
  const { description, ammount } = request.body

  const { customer } = request

  const customerOperation = {
    description,
    ammount,
    created_at: new Date(),
    type: 'credit'
  }

  customer.statement.push(customerOperation)

  return response.status(201).send()
})

app.post('/withdraw', verifyExistsAccountCpf, (request, response) => {
  const { ammount } = request.body
  const { customer } = request

  const balance = getBalance(customer.statement)

  if (balance < ammount) {
    return response.status(400).json({ error: 'Insufficient funds!'})
  }

  const customerOperation = {
    ammount,
    created_at: new Date(),
    type: 'debit'
  }

  customer.statement.push(customerOperation)

  return response.status(201).send()
})

app.get('/statement/date', verifyExistsAccountCpf, (request, response) => {
  const { customer } = request
  const { date } = request.query

  const formatDate = new Date(date + ' 00:00')

  const statement = customer.statement.filter(
    (statement) => {
      statement.created_at.toDateString() === 
      new Date(formatDate).toDateString()
    }
  )

  return response.json(statement)
})

app.put('/account', verifyExistsAccountCpf, (request, response) => {
  const { name } = request.body
  const { customer } = request

  customer.name = name
  
  return response.status(201).send()
})

app.get('/account', verifyExistsAccountCpf, (request, response) => {
  const { customer } = request

  return response.json(customer)
})

app.delete('/account', verifyExistsAccountCpf, (request, response) => {
  customer.splice(request.customer, 1)

  return response.status(200).json(customer)
})

app.listen(3333)