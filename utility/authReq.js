const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
const { customMessage } = require('../helpers/customResponses')

const authReq = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findOne({
      _id: decoded._id,
      email: decoded.email,
    })
    if (!user) throw new Error()

    req.token = token
    req.user = user

    console.log(user);
    console.log(token);
    console.log("This is it")

    next()
  } catch (error) {
    return res
      .status(401)
      .json(customMessage(false, 'The Auth Token is unauthorised ,Login again'))
  }
}

module.exports = authReq
