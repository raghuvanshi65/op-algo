const express = require('express')
const router = express.Router()
const {
  registerController,
  activationController,
  loginController,
  authorize
} = require('../controllers/auth.controller')
const {
  validForgotPassword,
  validResetPassword,
  validRegister,
  validLogin,
} = require('../helpers/validations')

router.post('/register', validRegister, registerController)
router.post('/activation', activationController)
router.post('/login', validLogin, loginController)
router.get('/authorize' , authorize)

module.exports = router
