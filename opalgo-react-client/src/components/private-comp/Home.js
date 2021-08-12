import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuth, authenticate, getCookie } from '../../helpers/auth'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { UpdateProfile } from './UpdateProfile'

const Home = () => {
  return (
    <>
      {isAuth()? isAuth().logInfo.profileUpdated === false ? <Redirect to="/updateprofile" /> : null : <Redirect to="/" />}
      <div>
        <h1>HOME PAGE</h1>
      </div>
    </>
  )
}

export default Home
