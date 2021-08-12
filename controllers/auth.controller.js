const UserModel = require('../models/User')
const expressJwt = require('express-jwt')
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../helpers/dbErrorHandling')
const sendGrid = require('@sendgrid/mail')
const {
  badRequest,
  customMessage,
  internalServerError,
} = require('../helpers/customResponses')
const { generateAuthToken } = require('../helpers/boilerplateFunc')
const { default: validator } = require('validator');
sendGrid.setApiKey(
  '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',
)

const googleClientId = process.env.GOOGLE_CLIENT
//Registering google Auth Server
const googleClient = new OAuth2Client(googleClientId)

// Register Controller it takes request and response checks if req body is undefined
// validates fields in req.body
// takes body fields , checks if email already exists
// creates auth Token , sends email with token for account activation
const registerController = (req, res, next) => {
  if (req.body === undefined) {
    return res.status(400).json(badRequest)
  }

  const error = validationResult(req)
  const { name, email, password } = req.body

  if (!error.isEmpty()) {
    const firstError = error.array().map((err) => err.msg)[0]
    return res.status(422).json(customMessage(false, firstError))
  } else {
    UserModel.findOne({ email }).exec((err, user) => {
      if (user) {
        return res
          .status(500)
          .json(customMessage(false, 'Email already exists , try another one'))
      } else {
        const token = generateAuthToken(
          { email, name, password },
          process.env.JWT_ACCOUNT_ACTIVATION,
          '15m',
        )

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Account Activation Link',
          html: `
            <h1>Please Click the Link to Activate Account</h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr/>
            <p>This email contains some information that must not be shared</p>
            `,
        }

        sendGrid
          .send(emailData)
          .then((sent) => {
            return res
              .status(200)
              .json(
                customMessage(
                  true,
                  `Email has been sent succesfully to ${email}`,
                ),
              )
          })
          .catch((err) => {
            return res.status(500).json(customMessage(false, errorHandler(err)))
          })
      }
    })
  }
}

// activation controller takes the jwt token from authorization header
// saves the user by decoding the jwt
const activationController = async (req, res) => {
  const authHeader = req.header('Authorization')
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '')

      console.log(token)

      const decoded = await jwt.verify(
        token,
        process.env.JWT_ACCOUNT_ACTIVATION,
      )
      const { name, email, password } = decoded
      const user = await new UserModel({ name, email, password })

      user
        .save()
        .then((result) => {
          return res
            .status(200)
            .json(
              customMessage(
                true,
                'user successfully joined the community',
                user.getPublicProfile(),
              ),
            )
        })
        .catch((err) => {
          const err1 = errorHandler(err)
          return res.status(401).json(customMessage(false, err1))
        })
    } catch (error) {
      console.log(error)
      return res
        .status(401)
        .json(customMessage(false, 'link is expired , Please SignUp again'))
    }
  } else {
    return res.status(400).json(badRequest())
  }
}

// login controller validates the request body
// and getUserByCredentials , genarate a new JWT token as well
const loginController = async (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0]
    return res.status(422).json(customMessage(false, firstError))
  }

  try {
    const user = await UserModel.getByCredentials(email, password, req.ip)
    if (user) {
      const token = user.generateUserAuthToken('7d')
      const { _id, name, Role , logInfo  } = user
      return res.status(200).json(
        customMessage(true, 'User logged in', {
          token,
          user: {
            _id,
            email,
            name,
            Role,
            logInfo
          },
        }),
      )
    }
  } catch (err) {
    if (err.message) res.status(401).json(customMessage(false, err.message))
    else res.status(500).json(internalServerError)
  }
}

//helps in authorizing every request
const authorize = async (req, res) => {
  const authHeader = req.header('Authorization')
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '')
      const decoded = await jwt.verify(
        token,
        process.env.JWT_ACCOUNT_ACTIVATION,
      )

      console.log(decoded)
      return res.status(200).json({
        message: true,
        body: 'Look At the console',
      })
    } catch (err) {
      return res.status(401).json(customMessage(false, `JWT ERR ${err}`))
    }
  }
  return res.status(400).json('FUKCED')
}

//google oauth login
const googleController = async (req, res) => {
  const { idToken } = req.body
  try {
    googleClient
      .verifyIdToken({ idToken, googleClientId })
      .then(async (response) => {
        const { email_verified, name, email } = response.payload
        if (email_verified) {
          await UserModel.findOne({ email }, async (err, user) => {
            if (user) {
              const token = await user.generateUserAuthToken('7d')
              const { _id, name, Role , logInfo } = user
              return res.status(200).json(
                customMessage(true, 'User logged in', {
                  token,
                  user: {
                    _id,
                    email,
                    name,
                    Role,
                    logInfo
                  },
                }),
              )
            } else {
              let password = email + process.env.JWT_ACCOUNT_ACTIVATION
              user = await new UserModel({
                name,
                email,
                password,
              })

              user
                .save()
                .then((result) => {
                  const token = user.generateUserAuthToken('7d')
                  const { _id, name, email, Role , logInfo } = result
                  return res.status(200).json(
                    customMessage(true, 'User logged in', {
                      token,
                      user: {
                        _id,
                        email,
                        name,
                        Role,
                        logInfo
                      },
                    }),
                  )
                })
                .catch((err) => {
                  console.log(err)
                  const error = errorHandler(err)
                  return res
                    .status(500)
                    .json(
                      customMessage(
                        false,
                        `An internal Server error occurred ${error}`,
                      ),
                    )
                })
            }
          }).exec()
        }
        return res.status(401).json(customMessage(false, 'unauthorized af'))
      })
      .catch((err) => {
        if (err.message) res.status(500).json(customMessage(false, err.message))
        else res.status(500).json(internalServerError)
      })
  } catch (error) {
    return res
      .status(500)
      .json(customMessage(false, `An internal server error occurred `))
  }
}

module.exports = {
  registerController,
  activationController,
  loginController,
  authorize,
  googleController,
}
