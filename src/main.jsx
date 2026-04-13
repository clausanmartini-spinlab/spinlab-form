import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'

const path = window.location.pathname
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {path === '/dashboard' ? <Dashboard /> : <App />}
  </React.StrictMode>
)
