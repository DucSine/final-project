require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT
const connectDB = require('./config/db')
const apiRoute = require('./routes/api.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

connectDB()
app.use('/api',apiRoute)
//
const {
    addResType,
    addRes,
    addFoodType,
    addFood,
    addUser
  } = require('./controllers/dev.controller');

const {getMonExample} = require('./example')
app.set('view engine', 'pug')
app.set('views', './views')

app.get('/test',(req,res)=> res.send('hello'))

app.post('/dev/addRestaurantType', addResType)
app.post('/dev/addRestaurant', addRes)

app.post('/dev/addFoodType', addFoodType)
app.post('/dev/addFood', addFood)

app.post('/dev/addUser', addUser)


app.listen(port, ()=>console.log(`run with http://localhost:${port}`))