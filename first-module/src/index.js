const express = require('express')
const { v4: uuidV4 } = require('uuid')

const app = express()
app.use(express.json())

const costumers = []

app.post('/account', (req, res) => {
  const { cpf, name } = req.body

  const costumersAlreadyExiste = costumers.some(
    costumer => costumer.cpf === cpf
  )

  if(costumersAlreadyExiste) {
    return res.status(400).json({ error: 'costumer already existe' })
  }

  costumers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: []
  })

  return res.status(201).send()
})

app.listen(3333)