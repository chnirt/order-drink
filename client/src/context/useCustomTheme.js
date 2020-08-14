import React, { useState, useContext, createContext } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { colors } from '@material-ui/core'

import { variable } from '../constants'

const { shade } = variable

const CustomThemeContext = createContext()

export function CustomThemeProvider({ children }) {
  const [darkState, setDarkState] = useState(
    JSON.parse(localStorage.getItem('dark')) || false
  )
  const palletType = darkState ? 'dark' : 'light'
  const [mainColor, setMainColor] = useState(
    localStorage.getItem('mainColor') || 'red'
  )

  const colorList = [
    'red',
    'pink',
    'purple',
    'deepPurple',
    'indigo',
    'blue',
    'lightBlue',
    'cyan',
    'teal',
    'green',
    'lightGreen',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deepOrange',
    'brown',
    'grey',
    'blueGrey'
  ]

  const main = colors[mainColor][shade]

  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main
      },
      secondary: {
        main
      }
    }
  })

  const getColor = (color = darkState) => {
    return colors[color][shade]
  }

  const toggleDarkMode = () => {
    localStorage.setItem('dark', !darkState)
    setDarkState(!darkState)
  }

  const handleMainColor = (color) => {
    localStorage.setItem('mainColor', color)
    setMainColor(color)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CustomThemeContext.Provider
        value={{
          main,
          getColor,
          darkState,
          toggleDarkMode,
          mainColor,
          handleMainColor,
          setMainColor,
          colorList
        }}
      >
        {children}
      </CustomThemeContext.Provider>
    </ThemeProvider>
  )
}

export const useCustomTheme = () => useContext(CustomThemeContext)
