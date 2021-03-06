const jwt = require('jsonwebtoken')

const Response = require('../../helpers/response.helper')
const User = require('../../models/User')

exports.protect = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization

  try {
    if (!token) 
      throw new Error('Không tìm thấy token!')
    
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decode.user.id)
    
    if (!user) 
      throw new Error('Token không đúng hoặc đã hết hạn!')
    
    req.user = user
    return next()
  } catch (error) {
    console.log(error)
    return Response.error(res, { message: error.message })
  }
}
