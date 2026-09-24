// -----------------------------------------------------------
//  [*] Entry point — mounts the React app
//
//  Renders <App /> (the Login page, App.jsx — the app's only
//  page) into the #root div of index.html under StrictMode.
//  Global styles (index.css — Tailwind) are pulled in here.
// -----------------------------------------------------------

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
