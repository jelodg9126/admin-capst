import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; 
import './App.css';  
import './components/win-container.css'
import './components/sidebar.css'
import './components/dashboard.css'
import './components/logAdmin.css'
import './components/AddAccount.css'
import './components/preLog.css'
import './components/settings.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
