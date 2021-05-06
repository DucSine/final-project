const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs-promise')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')

//validate
const { validationResult } = require('express-validator')
// Models
const User = require('../../models/User')
const RestaurantType = require('../../models/RestaurantType')
const Restaurant = require('../../models/Restaurant')
const Food = require('../../models/Food')
const Bill = require('../../models/Bill')

const Response = require('../../helpers/response.helper')
const limit = 10


exports.adminLogin = async (req, res, next) =>{
    res.render( './admin/login')
}