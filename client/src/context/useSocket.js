import React, { createContext, useContext, useRef, useEffect } from 'react'
import socket from 'socket.io-client'

import { variable } from '../constants'

const SocketContext = createContext()

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={SocketValue()}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

function SocketValue() {
  const socketRef = useRef()
  const token = localStorage.getItem('access-token')

  useEffect(() => {
    let isCancelled = false

    const runAsync = async () => {
      try {
        if (!isCancelled) {
          socketRef.current = socket.connect(variable.url, {
            query: { token }
          })
        }
      } catch (e) {
        if (!isCancelled) {
          throw e
        }
      }
    }

    runAsync()

    return () => {
      isCancelled = true
    }
  }, [])

  function socketOn(key = '', callback) {
    socketRef.current.on(key, (data) => callback(data))
  }

  function socketEmit(key = '', data) {
    socketRef.current.emit(key, data)
  }

  return { socketOn, socketEmit }
}
