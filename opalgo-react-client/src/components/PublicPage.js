import React, { useState, useReducer } from 'react'
import '../stylesheets/publicPage.css'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Forgot from './Forgot'
import Front from '../assets/25332.jpg'
import { motion } from 'framer-motion'

const PublicPage = ({ history }) => {
  const [toggle, setToggle] = useState(1)

  const handleToggle = (val) => {
    console.log('WORKING !!!! 101')
    setToggle(val)
  }

  let component =
    toggle === 1 ? (
      <>
        <SignIn toggler={handleToggle} history></SignIn>
        <div className="front-image">
          <img src={Front} alt="" width="900" />
        </div>
      </>
    ) : toggle === 2 ? (
      <>
        <div className="Features">
          <img src={Front} alt="" width="900" />
        </div>
        <SignUp toggler={handleToggle} history></SignUp>
      </>
    ) : (
      <>
        <div className="Features">
          <img src={Front} alt="" width="900" />
        </div>
        <Forgot toggler={handleToggle} history></Forgot>
      </>
    )

  return <div className="PublicPage">{component}</div>
}

export default PublicPage
