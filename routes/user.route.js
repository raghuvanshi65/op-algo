const express = require('express')
const router = express.Router()
const {
  uploadProfilePic,
  getProfilePic,
  updateUserData
} = require('../controllers/user.controller')
const authReq = require('../utility/authReq')
const multer = require('multer')
const path = require('path')
const { auth } = require('google-auth-library')

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match('.(jpeg|jpg|png|svg)$')){
      cb(new Error('Please upload correct file !!'))
    }
    console.log("This is multer man"+file.originalname)
    cb(undefined, true)
  },
})

router.post(
  '/upload',
  authReq,
  uploadProfilePic,
  (error, req, res, next) => {
    if (error) res.status(400).send(error.message)
  },
)

router.get('/getprofilepic/:id', getProfilePic)

router.post('/updateinfo' , authReq ,updateUserData  );

module.exports = router
