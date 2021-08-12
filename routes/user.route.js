const express = require('express')
const router = express.Router()
const {
  uploadProfilePic,
  getProfilePic,
} = require('../controllers/user.controller')
const authReq = require('../utility/authReq')
const multer = require('multer')
const path = require('path')

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match('.(jpeg|jpg|png|svg)$'))
      cb(new Error('Please upload correct file !!'))
    cb(undefined, true)
  },
})

router.post(
  '/upload',
  authReq,
  upload.single('filename'),
  uploadProfilePic,
  (error, req, res, next) => {
    if (error) res.status(400).send(error.message)
  },
)

router.get('/getprofilepic', authReq, getProfilePic)

module.exports = router
