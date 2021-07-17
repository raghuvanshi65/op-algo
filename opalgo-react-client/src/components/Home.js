import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuth, authenticate, getCookie } from '../helpers/auth'
import jwt from 'jsonwebtoken'
import axios from 'axios'

const Home = () => {
//   const [isAuthorised, setIsAuthorised] = useState(false)

//   useEffect(() => {
//     if (isAuth()) {
//       const token = getCookie('token')
//       let headers = {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       }
//       axios
//         .get('http://localhost:5000/auth/authorize', {}, { headers })
//         .then((res) => {
//           setIsAuthorised(res.data.message)
//         })
//         .catch((err) => {
//           console.log(err)
//         })
//     }
//   }, [])

  return (
    <>
      {isAuth()? null : <Redirect to="/" />}
      <div>
        <h1>HOME PAGE</h1>
      </div>
    </>
  )
}

export default Home
