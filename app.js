const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const AuthRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
const cors = require('cors')


dotenv.config({
  path: './config/config.env',
})

const app = express()
const PORT = process.env.SERVER_PORT || 8080

connectDB()

app.use(express.json())
app.use(cors())

app.use('/auth/', AuthRouter)
app.use('/user', userRouter)

if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    }),
  )
  app.use(morgan('dev'))
}

app.get('/expose', (req, res) => {
  const routes = []
  app._router.stack.forEach((middleware) => {
    if (middleware.route)
      routes.push({
        route: middleware.route.path,
        method: middleware.route.stack[0].method,
      })
    else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        let route = handler.route
        route &&
          routes.push({ route: route.path, method: route.stack[0].method })
      })
    }
  })
  return res.status(200).send(routes)
})

app.use('*', (req, res) => {
  res.status(404).send({
    accept: false,
    message: 'This route is not available , page not found',
  })
})

app.listen(PORT, () => {
  console.log(`The application is up and running on ${PORT}`)
})
