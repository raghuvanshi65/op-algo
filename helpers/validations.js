const { check } = require('express-validator')

//while registering
const validRegister = [
  check('name', 'Name is Required')
    .not()
    .isEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage('name must be between 4 - 32 characters'),
  check('email').not().isEmpty().isEmail().withMessage('email is required'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('password minimum length is 8')
    .matches(/\d/)
    .withMessage('password must contain a number'),
]

//while logging in
const validLogin = [
  check('email').isEmail().withMessage('email must be in the correct format'),
  check('email').not().isEmpty().withMessage('email is required'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('password minimum length is 8')
    .matches(/\d/)
    .withMessage('password must contain a number'),
]

//while forgot password request
const validForgotPassword = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('email is not in the correct format'),
]

//while resetting new password
const validResetPassword = [
  check('password')
    .not()
    .isEmpty()
    .isLength({
      min: 8,
    })
    .withMessage('Password must be of atleast 8 characters'),
]

module.exports = {
  validLogin,
  validRegister,
  validForgotPassword,
  validResetPassword,
}
