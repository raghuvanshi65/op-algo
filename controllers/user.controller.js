const UserModel = require('../models/User')
const expressJwt = require('express-jwt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../helpers/dbErrorHandling')
const {
  badRequest,
  customMessage,
  internalServerError,
} = require('../helpers/customResponses')

const uploadProfilePic = async (req, res) => {
  let strArr = req.body.filename.split(',')
  let buffer = new Buffer(strArr[1], 'base64')
  let filename =
    Date.now().toString() + '' + strArr[0].split('/')[1].split(';')[0]
  try {
    req.user.profile = buffer
    req.user.filename = filename
    await req.user.save()
    return res.status(200).json(
      customMessage(true, {
        message: 'Successfully uploaded',
      }),
    )
  } catch (error) {
    return res.status(500).status(internalServerError)
  }
}

const getProfilePic = async (req, res) => {
  try {
    console.log(req.params.id)
    const user = await UserModel.findById(req.params.id)
    console.log(user.email)
    if (!user.profile)
      return res.status(204).json(customMessage(false, 'No Image available'))

    res.set('Content-Type', 'image/jpg')
    return res.status(200).send(user.profile)
  } catch (error) {
    return res.status(500).status(internalServerError)
  }
}

const updateUserData = async (req, res) => {
  try {
    const {
      email,
      name,
      username,
      bio,
      code,
      platform,
      languages,
    } = req.body
    if (username === undefined || code === undefined || !platform || !languages)
      return res
        .status(400)
        .json(customMessage(false, 'Please Satisy Validations'))

    let user = req.user
    let user1 = await UserModel.findById(user._id)
    user1.username = username
    user1.code = code
    user1.bio = bio
    user1.platform = platform
    user1.languages = languages
    user1.logInfo.profileUpdated = true;

    if (!user) return res.status(500).json(internalServerError())
    else {
      await user1.save()
      console.log
      return res.status(200).json(
        customMessage(true, `user with ${email} updated` , {
          token: req.token,
          user: {
            _id : user._id,
            email,
            name,
            username,
            code,
            bio,
            platform,
            languages,
            logInfo : user1.logInfo
          },
        }),
      )
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json(internalServerError)
  }
}

module.exports = {
  uploadProfilePic,
  getProfilePic,
  updateUserData,
}
