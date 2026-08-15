import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'

function ThemeAwareToaster() {
  const { isDark } = useTheme()

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: {
          borderRadius: '16px',
          background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.12)',
        },
      }}
    />
  )
}

const savedTheme = window.localStorage.getItem('theme') || 'light'
const root = document.documentElement
root.classList.remove('dark', 'light')
root.classList.add(savedTheme)
root.style.colorScheme = savedTheme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ThemeAwareToaster />
    </ThemeProvider>
  </StrictMode>,
)
