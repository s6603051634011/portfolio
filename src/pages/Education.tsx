import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedLetters from '../components/AnimatedLetters'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro, { enter } from '../hooks/usePageIntro'
import '../education.css'

type Item = {
  title: string
  place: string
  status: 'present' | 'completed'
  period?: string // ใส่ช่วงเวลาเองได้ เช่น '2023 – Present'
  text: string
  color: number // สีประจำการ์ด 1-6 (= --c1..--c6 สำหรับพื้น/เส้น และ --t1..--t6 สำหรับตัวหนังสือ)
  courses?: string[] // วิชาที่เกี่ยวข้อง (จาก CV)
  icon: 'cap' | 'book'
}

// เพิ่มการ์ดใหม่ได้โดยคัดลอกก้อน { ... } แล้วแก้ข้อความ
const education: Item[] = [
  {
    title: 'Electronics Engineering Technology (Computer)',
    place: "King Mongkut's University of Technology North Bangkok (KMUTNB), College of Industrial Technology",
    status: 'present',
    period: 'Electronics Engineering Technology (Computer) · 4th year',
    text: 'Specializing in Computer Engineering, with hands-on software projects and a focus on cybersecurity.',
    color: 2,
    courses: [
      'Cybersecurity',
      'Computer Network Systems & Data Communication',
      'Operating System',
      'Linux Operating Systems & Administration',
      'Web Application Development',
      'Database & Data Technology',
    ],
    icon: 'cap',
  },
  {
    title: 'High School Diploma (Science-Mathematics Program)',
    place: 'St.Mary School (Marialai School)',
    status: 'completed',
    period: 'Science-Mathematics Program',
    text: 'Focused on advanced mathematics and science, with a strong interest in computer programming and technology.',
    color: 3,
    icon: 'book',
  },
]

// คำที่วิ่งในแถบด้านล่าง (ดึงจากข้อมูลด้านบน)
const ribbon = ['KMUTNB', 'Computer Engineering', 'Cybersecurity', 'St.Mary School', 'Science-Mathematics']

const Cap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /><path d="M22 9v6" />
  </svg>
)
const Book = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" /><path d="M5 17a3 3 0 0 1 3-3h11" />
  </svg>
)
const ICONS: Record<Item['icon'], ReactNode> = { cap: <Cap />, book: <Book /> }

// รูปทรงตกแต่งพื้นหลัง
const SHAPES: Shape[] = [
  { kind: 'ring', x: 84, y: 20, size: 90, color: 1, speed: -80 },
  { kind: 'dot', x: 92, y: 38, size: 26, color: 4, speed: -160 },
  { kind: 'star', x: 70, y: 62, size: 44, color: 5, speed: -60 },
  { kind: 'squig', x: 88, y: 82, size: 110, color: 6, speed: -120 },
  { kind: 'dot', x: 4, y: 92, size: 18, color: 2, speed: -200 },
]

export default function Education() {
  const root = useRef<HTMLElement>(null)

  usePageIntro(root, (q) => {
    // เส้น timeline ค่อยๆ ยาวลงตามการเลื่อน
    gsap.fromTo(q('.timeline-fill'), { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: q('.timeline')[0], start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
    })

    // การ์ด: สไลด์เข้าจากด้านขวาสลับซ้าย หมุนนิดๆ จุดบนเส้นเด้งตาม
    q('.t-item').forEach((item, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 88%' } })
      tl.add(enter(item.querySelector('.t-card'),
        { x: i % 2 ? -120 : 120, rotation: i % 2 ? -4 : 4, opacity: 0 }, { duration: 0.9, ease: 'power3.out' }))
        .add(enter(item.querySelector('.t-dot'), { scale: 0 }, { duration: 0.5, ease: 'back.out(3)' }), '-=0.6')
        .add(enter(item.querySelector('.t-icon'), { rotation: -180, scale: 0.4 }, { duration: 0.6, ease: 'back.out(2)' }), '-=0.5')
    })

    // แถบตัวหนังสือวิ่ง: เลื่อนหน้าเร็ว แถบก็วิ่งเร็วตาม และกลับทิศตามทิศการเลื่อน
    const track = q('.rb-track')[0]
    const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 })
    loop.totalTime(22 * 50) // เริ่มกลางๆ เพื่อให้วิ่งถอยหลังได้ไม่สะดุด
    ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 300)
        gsap.to(loop, {
          timeScale: self.direction * boost, duration: 0.2, overwrite: true,
          onComplete: () => { gsap.to(loop, { timeScale: self.direction, duration: 1 }) },
        })
      },
    })
  })

  // การ์ดเอียงตามเมาส์ (ใช้ gsap เพื่อไม่ให้ตีกับแอนิเมชันตอนเข้า)
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(e.currentTarget, { rotationX: -y * 6, rotationY: x * 8, transformPerspective: 900, duration: 0.4, ease: 'power2.out' })
  }
  const untilt = (e: PointerEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <section className="page edu fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />

      <h1 className="bg-title page-title">
        <AnimatedLetters text="Education." colorful />
      </h1>
      <p className="bg-sub" data-intro>Where I have studied.</p>

      <div className="timeline">
        <span className="timeline-fill" aria-hidden="true" />
        {education.map((it) => (
          <div className="t-item" key={it.title} style={{ '--ic': `var(--c${it.color})`, '--it': `var(--t${it.color})` } as CSSProperties}>
            <span className="t-dot" aria-hidden="true" />
            <article className="t-card" onPointerMove={tilt} onPointerLeave={untilt}>
              <div className="t-icon">{ICONS[it.icon]}</div>
              <div>
                <div className="t-top">
                  <h3>{it.title}</h3>
                  <span className={`badge ${it.status === 'completed' ? 'done' : ''}`}>{it.status}</span>
                </div>
                <p className="t-place">{it.place}</p>
                {it.period && <p className="t-period">{it.period}</p>}
                <p className="t-text">{it.text}</p>
                {it.courses && (
                  <div className="t-courses">
                    <p className="t-courses-title">RELEVANT COURSEWORK</p>
                    <ul>
                      {it.courses.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="ribbon-wrap" aria-hidden="true">
      <div className="ribbon">
        <div className="rb-track">
          {[0, 1].map((copy) =>
            ribbon.map((w, i) => (
              <span key={`${copy}-${i}`} style={{ '--rc': `var(--t${(i % 6) + 1})` } as CSSProperties}>
                {w}
              </span>
            ))
          )}
        </div>
      </div>
      </div>
    </section>
  )
}
