require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT
const connectDB = require('./config/db')
const apiRoute = require('./routes/api.route')
const viewRoute = require('./routes/view.route')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

connectDB()
//back-end

app.set('view engine', 'pug')
app.set('views', './resources/views')
app.use(cors())

app.get('/teet', (req,res)=> {
  
  res.render('index')
  


})

app.use('/api',apiRoute)
app.use('/', viewRoute)


//////////////////////////////////////////////
const {
    addResType,
    addRes,
    addFood,
    addUser
  } = require('./controllers/dev.controller');

const {getMonExample} = require('./example')


////////////////////////////
const multer = require('multer')
const upload = multer({dest: './resources/uploads'})
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
  const f = food._id
  const food2 = await Food.find()
  const d = await Food.find().count()
  console.log('fo2: '+typeof food2)

  //console.log('aa: '+ food2[0].price)
  //console.log(await Food.findById(f))
  var sum = []

  console.log('sum type: '+ typeof sum)
  for(var i= 0; i< d; i++)
    sum.push(Number(food2[i].price))
  const nSum = [...new Set(sum)]

  const len = nSum.length
  const foods = []
  for(var item of nSum){
    foods.push(await Food.findOne({price: item}).populate('restaurant'))
  }
  console.log('list: '+ foods)


  console.log('logggg:' +nSum)
  //console.log(food2)
}
findd()

const a = ['a','b','a', 1,1,3,2,3]
console.log([...new Set(a)])

////
const {protect}= require('./middlewares/user/auth')
const User = require('./models/User')

const Response = require('./helpers/response.helper')
app.get('/getme', protect, async(req, res, next)=>{

  return Response.success(res, req.user)
} )
app.listen(port, ()=>console.log(`run with http://localhost:${port}`))