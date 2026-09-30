import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/about', label: 'About', icon: '☺' },
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
        <a href="https://github.com/" target="_blank" rel="noreferrer">GH</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">in</a>
      </div>
    </aside>
  )
}