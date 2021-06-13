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


//////////////////////////////////////////////
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const fs = require('fs-promise')
const cloudinary = require('./config/cloudinaryConfig')

const Restaurant = require('./models/Restaurant')
const RestaurantType = require('./models/RestaurantType')
const Food = require('./models/Food')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { emailIsExists, decodeAuthToken } = require('./config/general')
const upload = multer({ dest: './resources/uploads' })

const Response = require('./helpers/response.helper')
app.get('/dev/addRes', (req, res) => res.render('addRes'))

app.post('/dev/addRes', async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })
  const {
    restaurantName,
    type,
    email,
    address,
    x,
    y,
    phone,
  } = req.body

  console.log(req.body)
  const password = 'duc231097'
  console.log(req.body)
  try {
    let restaurant = await Restaurant.findOne({ restaurantName })
    if (restaurant) throw new Error('Tên nhà hàng đã tồn tại')

    if (await emailIsExists(email))
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
      x: Number(x),
      y: Number(y),
      isVerified: true,

    })
    next()
  } catch (error) {
    console.log(error)
    return next(error)
  }
}, (req, res) => res.send(`<script>alert('Thành công')</script>`))

app.get('/dev/addFood', async (req, res) => {
  let restaurant = await Restaurant.find()
  res.render('addFood', { restaurant })
})

app.post('/dev/addFood', upload.single('image'), async (req, res, next) => {
  const {
    file,
    body: {
      foodName,
      price,
      caption,
      restaurant
    }
  } = req

  console.log(req)
  try {
    let food = await Food.findOne({ foodName, restaurant })
    if (food)
      throw new Error('Món đã tồn tại.')

    if (!file)
      throw new Error('Chưa có ảnh cho món này.')

    let orgName = file.originalname || ''
    orgName = orgName.trim().replace(/ /g, '-')
    const fullPathInServ = file.path
    const newFullPath = `${fullPathInServ}-${orgName}`
    fs.rename(fullPathInServ, newFullPath)

    const result = await cloudinary.uploader.upload(newFullPath)
    const urlUpload = result.url.replace('http://', 'https://')
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

}, (req, res) => res.send(`<script>alert('Thành công')</script>`))
///

const nameFemale = ['Thùy Trâm', 'Thùy Dương', 'Thùy Vi', 'Quỳnh', 'Thùy Ngân', 'Minh Anh', 'Thùy An', 'Ánh', 'Thùy Dung', 'Thu Trang', 'Minh Trang', 'Hoài Thương', 'Nhi', 'My'] //14
const usernameF_2 = ['thuytram', 'thuyduong', 'thuyvi', 'quynh', 'thuyngan', 'minhanh', 'thuyan', 'anh', 'thuydung', 'thutrang', 'minhtrang', 'hoaithuong', 'nhi']
const firstName_f = ['Hoàng Thị', 'Phan Thị', 'Võ Thị', 'Trịnh Thị', 'Nguyễn Thị', 'Lê Thị', 'Lý Thị', 'Phùng Thị', 'Hồ Thị'] // 9
const usernameF_1 = ['hoangthi', 'phanthi', 'vothi', 'trinhthi', 'nguyenthi', 'lethi', 'lythi', 'phungthi', 'hothi']

const nameMale = ['Anh Đức', 'Tùng', 'Nam', 'Minh', 'Đạt', 'Đức', 'Phúc', 'Bảo', 'Long', 'Thành', 'Tuấn'] //11
const usernameM_2 = ['anhduc', 'tung', 'nam', 'minh', 'dat', 'duc', 'phuc', 'bao', 'long', 'thanh', 'tuan']
const firstName_m = ['Hoàng Văn', 'Phan Văn', 'Võ Văn', 'Trịnh Văn', 'Nguyễn Văn', 'Lê Văn', 'Lý Văn', 'Phùng Văn', 'Hồ Văn'] // 9
const usernameM_1 = ['hoangvan', 'phanvan', 'vovan', 'trinhvan', 'nguyenvan', 'levan', 'lyvan', 'phungvan', 'hovan']

const streets = ['Phan Châu Trinh', 'Phan Bội Châu', 'Hoàng Diệu', 'Trưng Nữ Vương', 'Lê Đình Lý', 'Ngô Quyền', 'Thái Thị Bôi', 'Phan Tứ', 'Phan Thanh', 'Bạch Đằng', 'Trần Phú', 'Tôn Đức Thắng', 'Lê Thái Tông', 'Nguyễn Sinh Săc', 'Võ Nguyên Giáp', 'Nguyễn Tất Thành', 'Tô Hiệu', 'Tô Hiến Thành', 'Hoàng Văn Thụ', 'Hoàng Văn Thụ', 'Nguyễn Văn Thoại', 'Trần Cao Vân', 'Dũng Sĩ Thanh Khê']
const headNumPhone = ['09', '08', '07', '03', '02'] //5

// // function
// async function generalUser() {
//   let ffname_i = getRndInteger(0, 13) //famale
//   let fmname_i = getRndInteger(0, 10) //famale
//   let lname_i = getRndInteger(0, 8)

//   let street_i = getRndInteger(0, 22)
//   let no_House = getRndInteger(10, 120)

//   let getfID = getRndInteger(120, 980)
//   let getmID = getRndInteger(1000, 9999)
//   let getlID = getRndInteger(100, 999)

//   let phone_i = getRndInteger(0, 4)
//   let getmPhone = getRndInteger(100, 999)
//   let getlPhone = getRndInteger(10000, 99999)

//   let getBdate = getRndInteger(631126800000, 1041267600000)
//   const password = 'duc231097'
//   const salt = await bcrypt.genSalt(10)

//   console.log(getBdate)
//   const fmaleOBJ = {
//     username: usernameF_1[lname_i] + usernameF_2[ffname_i],
//     fullName: firstName_f[lname_i] +' '+ nameFemale[ffname_i],
//     phone: headNumPhone[phone_i] + getlPhone + getmPhone,
//     address: `${no_House}, ${streets[street_i]} , Đà Nẵng`,
//     bDate: new Date(getBdate),
//     ID: `${getfID}${getmID}${getlID}`,
//     gender: false,
//     email: usernameF_1[lname_i] + usernameF_2[ffname_i] + '@gmail.com',
//     password: await bcrypt.hash(password, salt),
//     isVerified: true,
//     isLock: false
//   }

//   console.log(fmaleOBJ)
//   // console.log('Thêm nữ thành công.')

//   const fmaleOBJ = {({
//     username: usernameM_1[lname_i] + usernameM_2[fmname_i],
//     fullName: firstName_m[lname_i] + nameMale[fmname_i],
//     phone: headNumPhone[phone_i] + getmPhone + getlPhone,
//     address: `${no_House}, ${streets[street_i]} , Đà Nẵng`,
//     bDate: new Date(getBdate),
//     ID: `${getfID}${getlID}${getmID}`,
//     email: usernameM_1[lname_i] + usernameM_2[fmname_i] + '@gmail.com',
//     password: await bcrypt.hash(password, salt),
//     isVerified: true,
//     isLock: false
//   }
//   // console.log('Thêm nam thành công.')
// }

// function getRndInteger(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// generalUser()
// app.post('/adduserbydev', async (req, res) => {
//   for (let i = 0; i <= 1000; i++){
//     generalUser()
//     console.log('Thành công')
//   }
    

//   return Response.success(res,{message: 'Thành Công'})
 
// })


// ///

server.listen(port, () => console.log(`run with http://localhost:${port}`))