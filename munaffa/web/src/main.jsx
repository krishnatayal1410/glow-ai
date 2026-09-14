import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Munaffa render failure:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-fallback">
          <div className="fatal-mark">MUNAFFA</div>
          <p className="fatal-kicker">3D renderer recovery mode</p>
          <h1>The restaurant world failed to initialise.</h1>
          <p className="fatal-copy">
            The product story is intact. The 3D renderer or one of its assets failed before the scene could mount.
          </p>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
          <button type="button" onClick={() => window.location.reload()}>Reload experience</button>
        </main>
      )
    }

    return this.props.children
  }
}

const root = document.getElementById('root')

if (!root) {
  document.body.innerHTML = '<main style="min-height:100vh;background:#0b0a08;color:#f4eee3;padding:48px;font-family:system-ui"><h1>Munaffa could not mount.</h1><p>The #root element is missing from index.html.</p></main>'
  throw new Error('Missing #root element')
}

createRoot(root).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>,
)
