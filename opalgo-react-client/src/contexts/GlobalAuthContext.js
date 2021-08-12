import axios from 'axios'
import React, { useContext, useState } from 'react'
import { authenticate, isAuth , getCookie } from '../helpers/auth'

export const GlobalAuthContext = React.createContext()

const GlobalAuthContextProvider = ({ children }) => {
  const [storedUser, setStoredUser] = useState(isAuth())
  const [token , setToken] = useState(getCookie())
  console.log(storedUser)
  const reloadStoredUser = () => {
    setStoredUser(isAuth())
    setToken(getCookie());
  }

  return (
    <GlobalAuthContext.Provider
      value={{
        storedUser,
        reloadStoredUser,
        authenticate ,
        token
      }}
    >
      {children}
    </GlobalAuthContext.Provider>
  )
}

export default GlobalAuthContextProvider;
