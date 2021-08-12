import React, { useState , useContext } from 'react'
import Logo from '../../assets/O2.svg'
import '../../stylesheets/signIn.css'
import { motion } from 'framer-motion'
import { Button, notification, Space } from 'antd'
import {
  SmileOutlined,
  CloseCircleOutlined,
  GoogleOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import { Redirect, useHistory } from 'react-router-dom'
import { authenticate, isAuth } from '../../helpers/auth'
import { GoogleLogin } from 'react-google-login'

import { successNotify, errorNotify } from '../../helpers/notify'

const initialFormData = {
  email: '',
  password: '',
}

const SignIn = ({ toggler }) => {
  let history = useHistory()

  const [formData, setFormData] = useState(initialFormData)
  const { email, password } = formData

  const handleChange = (field, e) => {
    setFormData((prev) => ({
      ...formData,
      [field]: e.target.value,
    }))
  }

  const responseGoogle = (response) => {
    console.log('response from google')
    if (response.tokenId) sendGoogleToken(response.tokenId)
  }

  const sendGoogleToken = (tokenId) => {
    axios
      .post(`http://localhost:5000/auth/googleLogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        console.log(res)
        informParent(res)
      })
      .catch((err) => {
        errorNotify(`Not Successful`, err.response.data.message)
      })
  }

  const informParent = (res) => {
    authenticate(res, () => {
      const auth = isAuth()
      if (auth && auth.Role === 'Admin') history.push('/admin')
      else history.push('/home')
    })
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
      {isAuth() ? (
        isAuth().Role === 'Admin' ? (
          <Redirect exact to="/admin" />
        ) : (
          <Redirect exact to="/home" />
        )
      ) : null}
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
              <span className="act-as-link" onClick={() => toggler(2)}>
                Sign Up
              </span>
            </div>
            <div className="">
              Forgot Password ?&nbsp;
              <span className="act-as-link" onClick={() => toggler(3)}>
                Click Here
              </span>
            </div>
          </form>
          <hr />
          <div className="oauth">
            <GoogleLogin
              theme="dark"
              clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              render={(renderProps) => (
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 1,
                    transition: { duration: 0 },
                  }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="google-oauth"
                >
                  <GoogleOutlined /> {'   '} Sign In With Google
                </motion.button>
              )}
            ></GoogleLogin>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignIn
