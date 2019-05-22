import React from 'react'
// import { Home, Notifications, Bookings, Planning, Settings, Login, SignIn } from 'containers'
import { Planning, Login, SignIn , Bookings } from '../containers'; //'../../containers'

export const routes = [
  {
    path: '/',
    name: 'Planning',
    exact: true,
    component: () => <Planning />
  },
  {
    path: '/login',
    name: 'Connexion',
    exact: true,
    component: () => <Login />
  },
  {
    path: '/signin',
    name: 'Créer un compte',
    exact: true,
    component: () => <SignIn />
  },
  {
    path: '/planning',
    name: 'Planning',
    exact: true,
    position: 'top',
    component: () => <Planning />
  },
  // {
  //   path: '/notifications',
  //   name: 'Notifications',
  //   exact: true,
  //   position: 'top',
  //   component: () => <Notifications />
  // },
  {
    path: '/bookings',
    name: 'Réservations',
    exact: true,
    position: 'top',
    component: () => <Bookings />
  },
  // {
  //   path: '/settings',
  //   name: 'Paramètres',
  //   exact: true,
  //   position: 'bottom',
  //   component: () => <Settings />
  // }
]