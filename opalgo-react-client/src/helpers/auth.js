import cookie from 'js-cookie'

//cookie setter
export const setCookie = (key, value) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1,
    })
  }
}

//remove cookie
export const removeCookie = (key) => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1,
    })
  }
}

//getter cookie
export const getCookie = (key) => {
  if (window !== undefined) {
    return cookie.get(key)
  }
}

//set In Local Storage
export const setLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

//remove from local Storage
export const removeLocalStorage = (key) => {
  if (window !== undefined) {
    localStorage.removeItem(key)
  }
}

//Setting info after users logs in .. for Authorization
export const authenticate = (response, next) => {
    console.log('WORKED')
  setCookie('token', response.data.data.token)
  setLocalStorage('user', response.data.data.user)
  
  console.log('WORKED 2')
  next()
}

//SignOut
export const signOut = (next) => {
  removeCookie('token')
  removeLocalStorage('user')
}

//get Info from localStorage
export const isAuth = () => {
  if (window !== undefined) {
    const cookieChecked = getCookie('token')
    if (cookieChecked) {
      if (localStorage.getItem('user'))
        return JSON.parse(localStorage.getItem('user'))
      return false
    }
    return false
  }
}

//update user info in localStorage
export const updateUser = (response, next) => {
  if (window !== undefined) {
    let auth = JSON.parse(localStorage.getItem('user'))
    auth = response.data
    localStorage.setItem('user', JSON.stringify(auth))
  }
  next()
}
