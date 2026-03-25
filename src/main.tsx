import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister())
      })
    }
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key))
    }).finally(() => window.location.reload())
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0d1117', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px', textAlign: 'center', fontFamily: 'sans-serif'
        }}>
          <img src="/film.png" alt="DMT Movie" style={{ width: 64, height: 64, marginBottom: 16, borderRadius: 16 }} />
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
            Có lỗi xảy ra
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 }}>
            Ứng dụng gặp sự cố. Thử làm mới để khắc phục.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: '#f97316', color: '#fff', border: 'none',
              borderRadius: 12, padding: '10px 24px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            Làm mới ứng dụng
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
