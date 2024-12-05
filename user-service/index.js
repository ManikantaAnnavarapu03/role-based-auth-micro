const express = require('express')
const {handleUserSignup} = require('./controller/controller')
const {connect} = require('./models/connect')

const app = express()

app.use(express.json())

connect()

handleUserSignup()

const port = process.env.PORT || 7011

app.listen(port, () => console.log("server started at", port))
 