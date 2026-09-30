import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// วาดเส้นขอบของตัว P ทีละน้อย แล้วค่อยเติมสีเข้าไป (สีมาจาก CSS: .logo path)
export default function Logo() {
  const path = useRef<SVGPathElement>(null)

  useEffect(() => {
    const p = path.current!
    const length = p.getTotalLength()

    gsap.set(p, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0 })
    gsap
      .timeline()
      .to(p, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 0.4 })
      .to(p, { fillOpacity: 1, duration: 1 })
  }, [])

  return (
    <svg className="logo" viewBox="0 0 120 120" role="img" aria-label="P logo">
      <path
        ref={path}
        d="M28 108 V12 H68 A28 28 0 0 1 68 68 H50 V108 Z"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
