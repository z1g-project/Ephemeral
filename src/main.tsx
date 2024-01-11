import { BrowserRouter, Route, Routes} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/welcome" Component={Welcome} />
      </Routes>
      </BrowserRouter>
  </React.StrictMode>
)
