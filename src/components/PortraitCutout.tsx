import { useEffect, useRef, useState, type CSSProperties } from 'react'
import '../portrait.css'

// ภาพตัดพื้นหลังที่ขยับตามเมาส์ มีหายใจเบาๆ และกดแล้วมีประกายพุ่งออก
export default function PortraitCutout() {
  const root = useRef<HTMLButtonElement>(null)
  const [burst, setBurst] = useState(0)
  const [pop, setPop] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // พารัลแลกซ์: เขียนค่า --mx/--my (-1 ถึง 1) ลงที่ element ตรงๆ ไม่ผ่าน state
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
    const loop = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--mx', cx.toFixed(3))
      el.style.setProperty('--my', cy.toFixed(3))
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)
      const ny = (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)
      tx = Math.max(-1, Math.min(1, nx))
      ty = Math.max(-1, Math.min(1, ny))
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const poke = () => {
    setBurst((b) => b + 1)
    setPop(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPop(false), 700)
  }

  const dec = (d: number, x: string, y: string) => ({ '--d': d, '--x': x, '--y': y }) as CSSProperties

  return (
    <button
      ref={root}
      type="button"
      className={`pt ${pop ? 'pt-pop' : ''}`}
      onClick={poke}
      aria-label="Portrait of Phimlaphat (press for sparkles)"
    >
      <span className="pt-ring" aria-hidden="true" />
      <span className="pt-arch" aria-hidden="true" />
      <span className="pt-dec pt-star" style={dec(26, '2%', '14%')} aria-hidden="true">✦</span>
      <span className="pt-dec pt-dot" style={dec(-20, '88%', '26%')} aria-hidden="true" />
      <span className="pt-dec pt-plus" style={dec(16, '91%', '68%')} aria-hidden="true">+</span>
      <span className="pt-dec pt-star small" style={dec(-14, '6%', '62%')} aria-hidden="true">✦</span>

      <span className="pt-fig">
        <img className="pt-img" src="/about/portrait-cutout.webp" alt="" />
      </span>

      {burst > 0 &&
        Array.from({ length: 8 }, (_, i) => (
          <span
            key={`${burst}-${i}`}
            className="pt-spark"
            style={{ '--a': `${i * 45}deg` } as CSSProperties}
            aria-hidden="true"
          >
            ✦
          </span>
        ))}
    </button>
  )
}
