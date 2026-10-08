import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GITHUB } from '../links'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/contact', label: 'Contact', mobileOnly: true }, // บนจอใหญ่ใช้ปุ่ม Contact ด้านขวาแทน
]

type Theme = 'warm' | 'night'

// สลับธีมกลางวัน (warm) / กลางคืน (night) และจำค่าที่เลือกไว้ในเบราว์เซอร์
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'night' ? 'night' : 'warm'
  )
  const toggle = () => {
    const next: Theme = theme === 'warm' ? 'night' : 'warm'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch { /* เบราว์เซอร์ไม่ให้เก็บค่า ก็ไม่เป็นไร */ }
    setTheme(next)
  }
  return [theme, toggle] as const
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, toggleTheme] = useTheme()
  const close = () => setOpen(false)

  return (
    <header className="topbar">
      <NavLink to="/" className="tb-brand" onClick={close} aria-label="Home">
        Phimlaphat<span>.</span>
      </NavLink>

      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={l.mobileOnly ? 'only-mobile' : undefined}
            onClick={close}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="tb-right">
        {GITHUB && (
          <a className="tb-gh" href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
        )}
        <button
          type="button"
          className="tb-theme"
          onClick={toggleTheme}
          aria-label={theme === 'warm' ? 'Switch to night theme' : 'Switch to day theme'}
          title={theme === 'warm' ? 'Night theme' : 'Day theme'}
        >
          {theme === 'warm' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          )}
        </button>
        <Link to="/contact" className="tb-cta">Contact ↗</Link>
        <button
          type="button"
          className="tb-menu"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}
