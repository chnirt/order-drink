import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'

// import "./styles.css";

import { routes } from './routes'
import PrivateRoute from './helpers/PrivateRoute'
import PublicRoute from './helpers/PublicRoute'
import Layout from './layouts'

export default function App() {
  return (
    <Switch>
      {routes?.map((route, i) => {
        const LazyComponent = lazy(() => {
          // return import(`./pages/${route.component}`);
          return new Promise(resolve => {
            setTimeout(() => resolve(import(`./pages/${route.component}`)), 500)
          })
        })
        switch (route.status) {
          case 'public':
            return (
              <PublicRoute key={i} path={route.path} exact={route.exact}>
                <LazyComponent />
              </PublicRoute>
            )
          case 'private':
            return (
              <PrivateRoute key={i} path={route.path} exact={route.exact}>
                <Layout {...route}>
                  <LazyComponent {...route} />
                </Layout>
              </PrivateRoute>
            )
          default:
            return (
              <Route key={i} path={route.path} exact={route.exact}>
                <LazyComponent />
              </Route>
            )
        }
      })}
    </Switch>
  )
}
