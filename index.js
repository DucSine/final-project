require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT||3000
const connectDB = require('./config/db')
const apiRoute = require('./routes/api.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

connectDB()
app.use('/api',apiRoute)
app.use('/test',(req,res)=> res.send('hello'))

app.listen(port, ()=>console.log(`run with http://localhost:${port}`))