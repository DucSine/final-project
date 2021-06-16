require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const { app, server } = require('./helpers/handleSocketIo.helper');
const port = process.env.PORT
const connectDB = require('./config/db')

const apiRoute = require('./routes/api.route')
const viewRoute = require('./routes/view.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

connectDB()

app.use(express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'pug')
app.set('views', './resources/views')
app.use(cors())

app.use('/api', apiRoute)
app.use('/', viewRoute)

server.listen(port, () => console.log(`run with http://localhost:${port}`))