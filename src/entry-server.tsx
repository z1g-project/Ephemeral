import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Routes from './routes'

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  )
  return { html }
}