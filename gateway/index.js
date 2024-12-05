const express = require('express')

const router = require('./service/router')

const morgan = require('morgan')

const app = express()
const port = process.env.PORT || 7010

app.use(express.json())

app.use(morgan())

app.use('/user',router )


app.listen(port, () => console.log("server started at", port))

