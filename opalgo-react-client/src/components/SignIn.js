import React, { useState } from 'react'
import Logo from '../assets/O2.svg'
import '../stylesheets/signIn.css'
import { motion } from 'framer-motion'
import { Button, notification, Space } from 'antd'
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Redirect , useHistory } from 'react-router-dom'
import { authenticate, isAuth } from '../helpers/auth'

const initialFormData = {
  email: '',
  password: '',
}

const SignIn = ({ toggler }) => {
  const [formData, setFormData] = useState(initialFormData)
  const { email, password } = formData
              let history = useHistory()

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
    console.log(e)
    if (email && password) {
      axios
        .post(`http://localhost:5000/auth/login`, {
          email,
          password,
        })
        .then((res) => {
          if (res.data.accept) {
            authenticate(res, () => {
              setFormData({
                ...formData,
                email: '',
                password: '',
              })
              console.log(res.data)
              if (res.data.accept === true)
                successNotify(`Sign In Successful`, res.data.message)
              else errorNotify(`Unsuccessful`, res.data.message)
            })
          } else errorNotify(`Not Successful`, res.data.message)
        })
        .catch((err) => {
          console.log('error is ')
          console.log(err)
          errorNotify(`Not Successful`, err.response.data.message)
        })
    } else {
      errorNotify(
        'All Fields are not set',
        `please fill all the fields to continue`,
      )
    }
  }

  return (
    <>
      {isAuth() ? isAuth().Role === 'admin' ? <Redirect exact to="/home" /> : <Redirect exact to="/home" /> : null}
      <div className="SignIn">
        <div className="body">
          <div className="header-content">
            <motion.img
              animate={{ scale: [0.8, 1], opacity: [0, 1] }}
              transition={{ duration: 0.4 }}
              src={Logo}
              alt=""
              width="100"
            ></motion.img>
            <h2>Welcome to OpAlgo Community</h2>
            <div>
              We Value Your Privacy <br />
              Please <span style={{ color: '#6530e2' }}>SignIn</span> To
              Continue with our app
            </div>
          </div>
          <hr />
          <form onSubmit={handleSubmit}>
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
              Don't Have an account ?&nbsp;
              <span className="act-as-link" onClick={()=>toggler(2)}>
                Sign Up
              </span>
            </div>
            <div className="">
            Forgot Password ?&nbsp;
              <span className="act-as-link" onClick={()=>toggler(3)}>
                Click Here
              </span>
            </div>
          </form>
          <hr />
        </div>
      </div>
    </>
  )
}

export default SignIn
