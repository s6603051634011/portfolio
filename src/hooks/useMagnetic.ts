import { useEffect, type RefObject } from 'react'

/* ปุ่มแม่เหล็ก: ปุ่มที่มีคลาส .mag ในกล่องนี้จะขยับเข้าหาเมาส์เบาๆ เมื่อเมาส์อยู่ใกล้
   ใช้เฉพาะเมาส์ (ไม่ทำงานบนจอสัมผัส) และปิดเองถ้าผู้ใช้ตั้งค่าลดการเคลื่อนไหว */
export default function useMagnetic(zone: RefObject<HTMLElement | null>, radius = 120, strength = 0.3) {
  useEffect(() => {
    const el = zone.current
    if (!el || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mags = [...el.querySelectorAll<HTMLElement>('.mag')]
    let raf = 0
    let last: PointerEvent | null = null
    const apply = () => {
      raf = 0
      if (!last) return
      for (const m of mags) {
        const r = m.getBoundingClientRect()
        const dx = last.clientX - (r.left + r.width / 2)
        const dy = last.clientY - (r.top + r.height / 2)
        const near = Math.hypot(dx, dy) < radius
        m.style.setProperty('--mx', near ? `${(dx * strength).toFixed(1)}px` : '0px')
        m.style.setProperty('--my', near ? `${(dy * strength).toFixed(1)}px` : '0px')
      }
    }
    const onMove = (e: PointerEvent) => { last = e; if (!raf) raf = requestAnimationFrame(apply) }
    const reset = () => mags.forEach((m) => { m.style.setProperty('--mx', '0px'); m.style.setProperty('--my', '0px') })
    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(raf)
      reset()
    }
  }, [zone, radius, strength])
}
