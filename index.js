const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo()

 


const app = express()
const port = 5000

app.use(express.json())
app.use(cors({
  origin:'*',
  methods:["POST",'GET','PUT','DELETE']
}))
//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})