import React, { useState, useEffect, useContext, createContext } from 'react'

import { useApi } from '../hooks/useApi'
import { variable } from '../constants'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={AuthValue()}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

function AuthValue() {
  const { onPost: loginOnPost } = useApi(`${variable.url}/users/login`)
  const { onPost: registerOnPost } = useApi(`${variable.url}/users/register`)

  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access-token'))

  const login = async (username, password) => {
    const data = await loginOnPost({ username, password })

    if (data) {
      const { access_token, refresh_token } = data
      localStorage.setItem('access-token', access_token)
      localStorage.setItem('refresh-token', refresh_token)
      localStorage.setItem('username', username)
      setIsAuth(true)
      return true
    } else {
      return false
    }
  }

  const register = async (username, password) => {
    const data = await registerOnPost({ username, password })

    if (data) {
      return true
    } else {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
    localStorage.removeItem('username')
    setIsAuth(false)
  }

  useEffect(() => {}, [])

  return {
    isAuth,
    login,
    register,
    logout
  }
}
