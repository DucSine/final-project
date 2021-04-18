require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const port = process.env.PORT
const connectDB = require('./config/db')
const apiRoute = require('./routes/api.route')
const viewRoute = require('./routes/view.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

connectDB()
app.use(express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'pug')
app.set('views', './resources/views')
app.use(cors())

app.use('/api',apiRoute)
app.use('/', viewRoute)


//////////////////////////////////////////////
const {
    addUser
  } = require('./controllers/dev.controller')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const fs = require('fs-promise')
const cloudinary = require('./config/cloudinaryConfig')

const Restaurant = require('./models/Restaurant')
const RestaurantType = require('./models/RestaurantType')
const Food = require('./models/Food')

const {emailIsExists} = require('./config/general')
const upload = multer({dest: './resources/uploads'})
app.get('/dev/addRes', (req,res) => res.render('addRes') )
app.post('/dev/addRestaurant', async (req,res, next) => {
  const errors = validationResult(req) 
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })
  const {
    restaurantName,
    type,
    email,
    address,
    phone,
  } = req.body

  const password = 'duc231097'
  console.log(req.body)
  try{
      let restaurant = await Restaurant.findOne({ restaurantName })
      if (restaurant) throw new Error('Tên nhà hàng đã tồn tại')
  
      if(await emailIsExists(email))
        throw new Error('Email đã tồn tại')
  
      const restaurantType = await RestaurantType.findById(type)
  
      if (!restaurantType) throw new Error('Loại hình không tồn tại')
      const salt = await bcrypt.genSalt(10);
      await Restaurant.create({
        restaurantName,
        email,
        password: await bcrypt.hash(password, salt),
        phone: phone,
        type: restaurantType._id,
        address,
        isVerified:true,
        
      })
      next()
    } catch (error) {
      console.log(error)
      return next(error)
    }
},(req, res)=>res.send(`<script>alert('Thành công')</script>`))


app.get('/dev/addFood',async(req,res)=>{
  let restaurant = await Restaurant.find()
   const len = await Restaurant.find().count()
  const restaurants = []
  for(var i = 0; i<len; i++)
    restaurants.push(restaurant[i])
  console.log(restaurants)
  console.log('len = ' + restaurant.length)
  res.render('addFood', {restaurant})
})

app.post('/dev/addFood',upload.single('image'),async(req, res, next)=>{
  const {
    file,
    body: {
      foodName,
      price,
      caption,
      restaurant
    }
  } = req
  try {
    let food = await Food.findOne({foodName, restaurant})
    if(food)
      throw new Error('Món đã tồn tại.')

    if(!file)
      throw new Error('Chưa có ảnh cho món này.')
    
    let orgName = file.originalname || ''
    orgName = orgName.trim().replace(/ /g, '-')
    const fullPathInServ = file.path
    const newFullPath = `${fullPathInServ}-${orgName}`
    fs.rename(fullPathInServ, newFullPath)
  
    const result = await cloudinary.uploader.upload(newFullPath)
    const urlUpload = result.url
    fs.unlinkSync(newFullPath)

    await Food.create({
      foodName,
      price,
      caption,
      restaurant,
      image: urlUpload
    })

    next()
  } catch (error) {
    console.log(error)
    return next(error)
  }

}, (req, res)=>res.send(`<script>alert('Thành công')</script>`))

app.post('/dev/addUser', addUser)

///

app.listen(port, ()=>console.log(`run with http://localhost:${port}`))