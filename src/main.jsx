import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import Upload from './Upload.jsx'

const path = window.location.pathname
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {path === '/dashboard' ? <Dashboard /> :
     path === '/upload' ? <Upload /> :
     <App />}
  </React.StrictMode>
)
