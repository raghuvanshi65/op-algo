const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
const { customMessage } = require('../helpers/customResponses')

const authReq = async (req, res, next) => {
    console.log("hjnkjhgfdfvgbhnj");
  try {
    console.log('This is user is fucking insane !!!')
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findOne({
      _id: decoded._id,
      email: decoded.email,
    })
    console.log()
    console.log('This is user')
    console.log(user)

    if (!user) throw new Error()

    req.token = token
    req.user = user

    console.log(user)
    console.log(token)
    console.log('This is it')

    next()
  } catch (error) {
    console.log(error)
    return res
      .status(401)
      .json(customMessage(false, 'The Auth Token is unauthorised ,Login again'))
  }
}

module.exports = authReq
