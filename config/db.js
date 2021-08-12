const mongoose = require('mongoose')
const { errorHandler } = require('../helpers/dbErrorHandling')

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    console.log(`mongo connection host is ${connection.connection.host}`)
  } catch (error) {
    console.log(`error : mongo connection is not established try whiteListing the IP`)
  }
}

module.exports = connectDB 
