const badRoute = {
  accept: false,
  message: 'This route does not exist',
}

const badRequest = {
  accept: false,
  message: 'This request is invalid',
}

const customMessage = (accept, message, data) => ({
  accept: accept,
  message: message,
  data: data,
})

const internalServerError = {
  accept: false,
  message: 'An internal server error occurred',
}

module.exports = {
  customMessage,
  badRoute,
  badRequest,
  internalServerError,
}
