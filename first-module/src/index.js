const { response } = require('express')
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

app.listen(3333)