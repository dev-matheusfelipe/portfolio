import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found')
}

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
