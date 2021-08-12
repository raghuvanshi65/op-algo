const mongoose = require('mongoose')
const crypto = require('crypto')
const { timeStamp } = require('console')
const bcrypt = require('bcryptjs')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      reqiured: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      reqiured: true,
    },
    password: {
      type: String,
      trim: true,
      reqiured: true,
    },
    Role: {
      type: String,
      default: 'User',
    },
    logInfo: {
      count: {
        type: Number,
        default: 0,
      },
      currentIP: {
        type: String,
        reqiured: false,
      },
      profileUpdated: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    username: {
      type: String,
      reqiured: false,
    },
    code: {
      type: Number,
      reqiured: false,
    },
    profile: {
      type: Buffer,
      reqiured: false,
    },
    filename: {
      type: String,
      required: false,
    },
    platform: [
      {
        platform: {
          type: String,
          reqiured: false,
        },
        url: {
          type: String,
          reqiured: false,
        },
      },
    ],
    bio: {
      type: String,
      reqiured: false,
    },
    languages: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 4)
  }
  next()
})

userSchema.methods = {
  authenticate: function (email) {
    return bcrypt.compare(plainPassword, userPassword)
  },
}

userSchema.statics.getByCredentials = async function (email, password, ip) {
  const user = await UserModel.findOne({ email })
  if (!user) throw new Error('No User found with given credentials')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Incorrect credentials')

  user.logInfo.currentIP = ip
  user.logInfo.count = user.logInfo.count + 1
  await user.save()
  return user
}

userSchema.methods.generateUserAuthToken = async function (expires) {
  const user = this
  const token = jsonwebtoken.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: expires },
  )

  return token
}

userSchema.methods.getPublicProfile = function () {
  const user = this
  const obj = user.toObject()

  delete obj.password
  delete obj._id

  return obj
}

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
