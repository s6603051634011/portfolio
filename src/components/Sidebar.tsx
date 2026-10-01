import { NavLink } from 'react-router-dom'
import { GITHUB } from '../links'

const links = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/about', label: 'About', icon: '☺' },
  { to: '/projects', label: 'Projects', icon: '▦' },
  { to: '/education', label: 'Education', icon: '✦' },
  { to: '/contact', label: 'Contact', icon: '✉' },
]

export default function Sidebar() {
  return (
    <aside className="side">
      <NavLink to="/" className="brand" aria-label="Home">
        P<small>Phimlaphat</small>
      </NavLink>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end>
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="soc">
        {GITHUB && (
          <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
        )}
      </div>
    </aside>
  )
}
