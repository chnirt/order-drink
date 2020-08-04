export const routes = [
  {
    label: 'Login',
    path: '/login',
    component: 'login',
    status: 'public'
  },
  {
    label: 'App',
    path: '/',
    component: 'root',
    status: 'private',
    private: true,
    routes: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        // component: 'dashboard',
        component: 'todaywhooffer'
      },
      {
        label: 'TodayWhoOffer',
        path: '/todaywhooffer',
        component: 'todaywhooffer'
      },
      {
        label: 'Order',
        path: '/order/:orderId',
        component: 'order',
        exact: true
      },
      {
        label: 'Invitation',
        path: '/invitation',
        component: 'invitation'
      }
    ]
  },
  {
    label: 'NoMatch',
    path: '*',
    component: 'NoMatch',
    status: 'notfound'
  }
]
