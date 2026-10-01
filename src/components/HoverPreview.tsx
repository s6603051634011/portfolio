import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  children: ReactNode
  title: string
  desc: string
  image?: string
  to?: string // ลิงก์ในเว็บ เช่น "/projects"
  href?: string // ลิงก์ภายนอก
}

// ข้อความที่ชี้เมาส์ (หรือกด Tab) แล้วมีการ์ด preview เด้งขึ้น
export default function HoverPreview({ children, title, desc, image, to, href }: Props) {
  const link = to ? (
    <Link to={to} className="hp-link">{children}</Link>
  ) : href ? (
    <a href={href} target="_blank" rel="noreferrer" className="hp-link">{children}</a>
  ) : (
    <span className="hp-link" tabIndex={0}>{children}</span>
  )

  return (
    <span className="hp">
      {link}
      <span className="hp-card" role="tooltip">
        {image && <img src={image} alt="" />}
        <strong>{title}</strong>
        <span>{desc}</span>
      </span>
    </span>
  )
}
