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
  try {
    req.user.profile = req.file.buffer
    req.user.filename = req.file.originalname
    await req.user.save()
    return res.status(200).json(
      customMessage(true, {
        filename: req.file.originalname,
        message: 'Successfully uploaded',
      }),
    )
  } catch (error) {
    return res.status(500).status(internalServerError)
  }
}

const getProfilePic = async(req,res) =>{
    try {
        const user = req.user;
        if(!user.profile)
            return res.status(204).json(customMessage(false,"No Image available"));
        
        res.set('Content-Type' , 'image/jpg')
        return res.status(200).send(user.profile);
    } catch (error) {
        return res.status(500).status(internalServerError)
    }
}

module.exports = {
  uploadProfilePic,
  getProfilePic
}
