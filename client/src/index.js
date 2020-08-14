import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { CustomThemeProvider } from './context/useCustomTheme'
import { I18nProvider } from './context/useI18n'
import { SocketProvider } from './context/useSocket'
import { AuthProvider } from './context/useAuth'
import { TodoProvider } from './context/useTodo'
import Loading from './components/Loading'
import './i18n'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        // iconVariant={{
        //   success: "✅",
        //   error: "✖",
        //   warning: "⚠️",
        //   info: "ℹ️"
        // }}
        preventDuplicate
      >
        <I18nProvider>
          <Suspense fallback={<Loading />}>
            <BrowserRouter basename="/🥤">
              <SocketProvider>
                <AuthProvider>
                  <TodoProvider>
                    <App />
                  </TodoProvider>
                </AuthProvider>
              </SocketProvider>
            </BrowserRouter>
          </Suspense>
        </I18nProvider>
      </SnackbarProvider>
    </CustomThemeProvider>
  </React.StrictMode>,
  rootElement
)
