import React, { useContext, createContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const I18nContext = createContext()

export function I18nProvider({ children }) {
  return (
    <I18nContext.Provider value={I18nValue()}>{children}</I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)

function I18nValue() {
  const { i18n } = useTranslation()

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
    window.localStorage.setItem('language', lng)
  }

  useEffect(() => {
    i18n.changeLanguage(window.localStorage.getItem('language'))
  }, [i18n])

  return {
    language: window.localStorage.getItem('language') || i18n.language,
    changeLanguage
  }
}
