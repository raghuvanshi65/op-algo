import axios from 'axios'
import React, { useContext, useState } from 'react'
import { authenticate, isAuth } from '../helpers/auth'

export const GlobalAuthContext = React.createContext()

const GlobalAuthContextProvider = ({ children }) => {
  const [storedUser, setStoredUser] = useState(isAuth())
  console.log(storedUser)
  const reloadStoredUser = () => {
    setStoredUser(isAuth())
  }

  return (
    <GlobalAuthContext.Provider
      value={{
        storedUser,
        reloadStoredUser,
        authenticate
      }}
    >
      {children}
    </GlobalAuthContext.Provider>
  )
}

export default GlobalAuthContextProvider;
