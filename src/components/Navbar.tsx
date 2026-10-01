import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GITHUB } from '../links'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/contact', label: 'Contact', mobileOnly: true }, // บนจอใหญ่ใช้ปุ่ม Contact ด้านขวาแทน
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
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
