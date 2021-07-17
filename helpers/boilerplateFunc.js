const jwt = require('jsonwebtoken')

const generateAuthToken = (tokenObject, secret, expires) => {
  return jwt.sign(tokenObject, secret, {
    expiresIn: expires,
  })
}

module.exports = {
  generateAuthToken,
}
