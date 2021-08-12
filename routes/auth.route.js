const express = require('express')
const router = express.Router()
const {
  registerController,
  activationController,
  loginController,
  authorize,
  googleController,
} = require('../controllers/auth.controller')
const {
  validForgotPassword,
  validResetPassword,
  validRegister,
  validLogin,
} = require('../helpers/validations')
const multer = require('../app')

router.post('/register', validRegister, registerController)
router.post('/activation', activationController)
router.post('/login', validLogin, loginController)
router.get('/authorize', authorize)
router.post('/googleLogin', googleController)

module.exports = router
