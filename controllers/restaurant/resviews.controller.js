const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')
//validate
const { validationResult } = require('express-validator')

// Models
const User = require('../../models/User')
const RestaurantType = require('../../models/RestaurantType')
const Restaurant = require('../../models/Restaurant')
const sendEmail = require('../../utils/sendEmail')

exports.index = async(req, res, next) => {
    res.render('./restaurant/index')
}