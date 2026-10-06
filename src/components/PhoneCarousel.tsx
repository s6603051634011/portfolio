import { useEffect, useRef, useState } from 'react'
import '../carousel.css'

type Slide = { src: string; alt: string; caption: string }

// ถ้าจอกว้างพอจะเห็นทุกภาพพร้อมกัน ปุ่มและจุดจะซ่อนเอง ถ้าจอแคบจะเลื่อนทีละภาพได้
export default function PhoneCarousel({ slides }: { slides: Slide[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [index, setIndex] = useState(0)

  const stepOf = (el: HTMLDivElement) => {
    const first = el.children[0] as HTMLElement | undefined
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16
    return (first?.offsetWidth ?? 260) + gap
  }

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => setOverflow(el.scrollWidth > el.clientWidth + 4)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const behavior = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

  const goTo = (i: number) => {
    const el = track.current
    if (!el) return
    const n = Math.max(0, Math.min(slides.length - 1, i))
    el.scrollTo({ left: n * stepOf(el), behavior: behavior() })
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / stepOf(el)))
  }

  return (
    <div className="pc">
      <div className="pc-track" ref={track} onScroll={onScroll} tabIndex={0} aria-label="App screenshots">
        {slides.map((s) => (
          <figure className="pc-slide" key={s.src}>
            <img src={s.src} alt={s.alt} loading="lazy" />
            <figcaption>{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      {overflow && (
        <div className="pc-nav">
          <button type="button" className="pc-btn" aria-label="Previous screenshot" disabled={index <= 0} onClick={() => goTo(index - 1)}>←</button>
          <div className="pc-dots">
            {slides.map((s, i) => (
              <button
                type="button"
                key={s.src}
                className={`pc-dot ${i === index ? 'on' : ''}`}
                aria-label={`Screenshot ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button type="button" className="pc-btn" aria-label="Next screenshot" disabled={index >= slides.length - 1} onClick={() => goTo(index + 1)}>→</button>
        </div>
      )}
    </div>
  )
}
