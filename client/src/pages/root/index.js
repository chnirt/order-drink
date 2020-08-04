import React, { Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Loading from '../../components/Loading'

export default function Root({ routes }) {
  return (
    <Route
      render={({ location }) => {
        return (
          <Suspense fallback={<Loading />}>
            <Switch>
              {routes?.map((route, i) => {
                const LazyComponent = lazy(() => {
                  // return import(`./pages/${route.component}`);
                  return new Promise(resolve => {
                    setTimeout(
                      () => resolve(import(`../${route.component}`)),
                      500
                    )
                  })
                })
                return (
                  <Route key={i} path={route.path} exact={route.exact}>
                    <LazyComponent />
                  </Route>
                )
              })}
              <Redirect to="/dashboard" />
            </Switch>
          </Suspense>
        )
      }}
    />
  )
}
