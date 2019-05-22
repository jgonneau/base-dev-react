import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import Parse from 'parse'
import { App } from 'containers'

import 'styles/global.scss'

Parse.initialize(
  'vj84kC1bckQ8VVeCPDUf1',
  'V4GJLX5Vh0ZpOyMfpJ0m1',
  'bKs82bwRSPA8C8yTV7jB1'
)
Parse.serverURL = 'https://club-easy-parse-server.herokuapp.com/parse'
Parse.masterKey = 'bKs82bwRSPA8C8yTV7jB1'

const customHistory = createBrowserHistory()

const Provider = () => {
  return ((
  <Router history={customHistory}>
    <App />
  </Router>
))
}

ReactDOM.render(
  <Provider />,
  document.getElementById('root')
)
