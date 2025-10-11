import '@ant-design/v5-patch-for-react-19'
import '@shared/styles/global.scss'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './app/Router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
