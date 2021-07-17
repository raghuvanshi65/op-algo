import React, { useState } from 'react'
import '../stylesheets/signUp.css'
import Logo from '../assets/O2.svg'
import { motion } from 'framer-motion'
import { Button, notification, Space } from 'antd'
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { authenticate, isAuth } from '../helpers/auth'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const SignUp = ({ toggler }) => {
  const [formData, setFormData] = useState(initialFormData)
  const { name, email, password, confirmPassword } = formData

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

  const handleChange = (field, e) => {
    setFormData((prev) => ({
      ...formData,
      [field]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        axios
          .post(`http://localhost:5000/auth/register`, {
            name,
            email,
            password,
          })
          .then((res) => {
            setFormData({
              ...formData,
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            })

            console.log('response is ')
            console.log(res.data)
            successNotify(`Sign Up Successful`, res.data.message)
          })
          .catch((err) => {
            console.log('error is ')
            console.log(err)
            errorNotify(`Not Successful`, err.response.data.message)
          })
      } else {
        errorNotify(
          `Passwords doesn't match`,
          `please fill all the Passwords correctly to continue`,
        )
      }
    } else {
      errorNotify(
        'All Fields are not set',
        `please fill all the fields to continue`,
      )
    }
  }

  return (
    <>
      {isAuth() ? <Redirect exact to="/home" /> : null}
      <div className="SignUp">
        <div className="body">
          <div className="header-content">
            <motion.img
              animate={{ scale: [0.8, 1] }}
              transition={{ duration: 0.4 }}
              src={Logo}
              alt=""
              width="150"
            ></motion.img>
            <h2>Join The Community</h2>
            <div>
              Please <span style={{ color: '#6530e2' }}>SignUp</span> To
              Continue with our app
            </div>
            <form onSubmit={handleSubmit} id="signUpForm">
              <div className="form-div">
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => handleChange('name', e)}
                  placeholder="Full Name"
                />
              </div>
              <div className="form-div">
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => handleChange('email', e)}
                  placeholder="Email"
                />
              </div>
              <div className="form-div">
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => handleChange('password', e)}
                  placeholder="Password"
                />
              </div>
              <div className="form-div">
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e)}
                  placeholder="Confirm Password"
                />
              </div>
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
                  Submit
                </motion.button>
              </div>
              <div className="to-Toggle">
                Already Have an acoount ?{' '}
                <span className="act-as-link" onClick={()=>
                    toggler(1)}>
                  Sign In
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
