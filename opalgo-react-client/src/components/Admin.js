import React from 'react'
import { Redirect } from 'react-router-dom'
import { isAuth, authenticate } from '../helpers/auth'

const Admin = () => {
    return (
        <>
      {isAuth() ? null : <Redirect to="/" />}
      <div>
        <h1>ADMIN PAGE</h1>
      </div>
    </>
    )
}

export default Admin;
