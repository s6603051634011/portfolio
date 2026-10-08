import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'animate.css'
import 'leaflet/dist/leaflet.css'
import App from './App'
import './index.css'
import './navbar.css' // ต้องอยู่หลัง index.css เพื่อทับกฎ sidebar เดิม
import './cursor.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
)
