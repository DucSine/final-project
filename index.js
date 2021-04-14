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

app.set('view engine', 'pug')
app.set('views', './views')

//////////////////////////////////////////////
const {
    addResType,
    addRes,
    addFoodType,
    addFood,
    addUser
  } = require('./controllers/dev.controller');

const {getMonExample} = require('./example')


////////////////////////////
const multer = require('multer')
const upload = multer({dest: './public/uploads'})
app.post('/dev/addRestaurantType', addResType)
app.post('/dev/addRestaurant', upload.single('banner'), addRes)

app.post('/dev/addFood',upload.single('image'), addFood)

app.post('/dev/addUser', addUser)


///
const Restaurant = require('./models/Restaurant')
const Food = require('./models/Food')

const findd = async()=>{
  const res = await Restaurant.find({restaurantName:'Cua Đồng 101'})
  const food = await Food.findOne({price:30000, foodName: 'Bún thập cẩm'})
  const f = food._id.toString()
  console.log(await Food.findById(f))
}
findd()

////
const {protect}= require('./middlewares/user/auth')
const User = require('./models/User')
app.get('/testlog',protect,async(req, res, next)=>{
  

  const us = await User.findById({_id: req.user._id})
  console.log(us)
  res.send(us)
  
})
const Response = require('./helpers/response.helper')
app.get('/getme', protect, async(req, res, next)=>{

  return Response.success(res, req.user)
} )
app.listen(port, ()=>console.log(`run with http://localhost:${port}`))