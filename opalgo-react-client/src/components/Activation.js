import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Logo from '../assets/O2.svg'
import { authenticate, isAuth } from '../helpers/auth'
import { Link, Redirect } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { Button, notification, Space } from 'antd'
import { motion } from 'framer-motion'
import '../stylesheets/activation.css'

const initialFormData = {
  name: '',
  token: '',
  show: true,
}

const Activation = (props) => {
  let config
  const [formData, setFormData] = useState(initialFormData)

  const successNotify = (message, description) => {
    notification.open({
      message: message,
      description: description,
      type: 'success',
    })
  }

  const errorNotify = (message, description) => {
    notification.open({
      message: message,
      description: description,
      type: 'error',
    })
  }

  useEffect(() => {
    let token, name
    async function getTokenData(settingValues) {
      token = props.match.params.token
      name = await jwt.decode(token).name
      console.log(name)
      if (token) {
        settingValues({ ...formData, token, name })
      }
    }
    getTokenData(setFormData)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    let headers = {
      'Authorization': `Bearer ${formData.token}`,
      'Content-Type': 'application/json',
    }
    axios
      .post(`http://localhost:5000/auth/activation`, {} , { headers })
      .then((res) => {
        setFormData({ ...formData, show: false })
        let accept = res.data.accept ? 'Successful' : 'Not Successful'
        if (res.data.accept) successNotify(accept, res.data.message)
        else errorNotify(accept, res.data.message)
      })
      .catch((err) => {
        console.log(err)
        errorNotify(`Not Successful`, err.response.data.message)
      })
  }

  return (
    <div className="Activation">
      <div className="activation-content">
        <motion.img
          animate={{ scale: [0.8, 1] }}
          transition={{ duration: 0.4 }}
          src={Logo}
          alt=""
          width="150"
        ></motion.img>
        <h2>
          Welcome {formData.name} , Please click below to activate your account
        </h2>
        <hr />
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="form-div">
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              Activate Account
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Activation
