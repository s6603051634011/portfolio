import { useEffect, useRef, type CSSProperties } from 'react'
import AnimatedLetters from '../components/AnimatedLetters'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro from '../hooks/usePageIntro'
import PhoneCarousel from '../components/PhoneCarousel'
import { COURT_LIVE, COURT_REPO } from '../links'
import '../stack.css'

type Shot = { src: string; alt: string; caption: string; ratio?: string }
type Project = {
  title: string
  blurb: string
  points: string[]
  tech: string[]
  shots?: Shot[]
  twoCols?: boolean // แกลเลอรี 2 ช่อง (ภาพกว้าง + ภาพสูง)
  carousel?: boolean // ภาพหน้าจอมือถือแบบสไลด์
  narrow?: boolean // มีภาพเดียวและไม่ต้องกว้างเต็มการ์ด
  repo?: string
  live?: string
}

const projects: Project[] = [
  {
    title: 'Sports Court Booking',
    blurb: 'A web app for booking sports courts, built with a team of six.',
    points: [
      'Customers pick a court, a date within 7 days and a time slot, then upload a payment slip.',
      'Unpaid bookings expire after 15 minutes so slots are released automatically.',
      'Firestore runTransaction prevents two people from booking the same slot.',
      'Staff dashboard with PIN-protected admin access.',
      '46 Jest / React Testing Library cases cover the customer booking flow.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore', 'Vercel', 'Jest'],
    shots: [
      { src: '/projects/booking-form.png', alt: 'Booking form with court, date and time selection', caption: 'Booking form' },
      { src: '/projects/payment.png', alt: 'Payment step with QR code, slip upload and 15-minute countdown (QR and account name blurred)', caption: 'Payment and 15-min countdown' },
      { src: '/projects/dashboard.png', alt: 'Staff dashboard listing bookings', caption: 'Staff dashboard' },
      { src: '/projects/architecture.png', alt: '3-tier architecture diagram: Next.js on Vercel, API routes, Firebase', caption: '3-tier architecture' },
    ],
    repo: COURT_REPO,
    live: COURT_LIVE,
  },
  {
    title: 'Thai Tax Invoice OCR (Senior Thesis)',
    blurb: 'A two-person thesis project: extracting structured data from Thai tax invoices.',
    points: [
      'A web app for phones: photograph or pick an invoice, upload it, and the server reads it through a GPU queue.',
      'Typhoon-OCR 1.5 (2B) fine-tuned with QLoRA answers 14 invoice fields and returns them as JSON.',
      'Rule checks (tax ID checksum, amount arithmetic) flag fields for human review before anything is saved.',
      'Designed to run on-premise, for data privacy and to avoid external API costs.',
      'Handles hard cases such as quantity and unit price embedded in the description field.',
    ],
    tech: ['Python', 'Typhoon-OCR 1.5', 'QLoRA', 'Qwen2.5-VL'],
    twoCols: true,
    shots: [
      { src: '/projects/ocr-compare.jpg', ratio: '16 / 9', alt: 'Photo of a tax invoice next to the extracted JSON; company names, addresses and tax IDs are blurred', caption: 'Invoice photo to extracted JSON (identifiers blurred)' },
      { src: '/projects/ocr-pipeline.png', ratio: '2 / 3', alt: 'Pipeline: upload, resize, GPU queue, auto-rotate, Typhoon OCR, JSON check, validation, user review, save', caption: 'System flow (click to enlarge)' },
    ],
  },
  {
    title: 'NOC Assistant (AI Network Chatbot)',
    blurb: 'A chatbot for monitoring and configuring a Linux server in plain Thai, powered by a local LLM.',
    points: [
      'Ask a question in Thai and the model calls tools over SSH to fetch real CPU, memory, disk, interface, route and connection data, then explains the result in everyday language.',
      'Runs llama3.2:3b locally through Ollama with function calling, so server data stays on the local network.',
      'Config changes such as adding an IP address are held until the user confirms; read-only questions run straight away.',
      'Streamlit dashboard with quick-monitor and quick-config buttons.',
    ],
    tech: ['Python', 'Streamlit', 'Ollama', 'llama3.2:3b', 'Paramiko (SSH)', 'Function calling'],
    shots: [
      { src: '/projects/noc-ui.jpg', ratio: '1917 / 868', alt: 'NOC Assistant dashboard with quick-monitor and quick-config buttons in the sidebar and a chat input', caption: 'NOC Assistant dashboard (Streamlit)' },
    ],
  },
  {
    title: 'MyMood (Mobile App)',
    blurb: 'A mobile app for tracking daily habits, moods and journal entries.',
    points: [
      'Daily habit checklist with a weekly strip of puzzle pieces and a counter of finished habits (4/9 in the screenshot).',
      'Monthly mood calendar where each day is a puzzle piece showing that day’s mood, with a count for each of the four moods.',
      'Journal with a mood emoji, timestamps, search by text or #tags, and delete.',
      'Bottom navigation bar with a quick-add button.',
    ],
    tech: ['Flutter', 'Dart'],
    carousel: true,
    shots: [
      { src: '/projects/mymood-home.png', alt: 'MyMood home screen: weekly puzzle-piece strip and a habit checklist with 4 of 9 done', caption: 'Daily habits' },
      { src: '/projects/mymood-calendar.png', alt: 'Mood calendar for October 2026 with puzzle-piece days and mood counts', caption: 'Mood calendar' },
      { src: '/projects/mymood-journal.png', alt: 'Journal screen with a search bar and one entry', caption: 'Journal' },
    ],
  },
  {
    title: 'DIY Power Supply (Electronic Practice I)',
    blurb: 'A power supply I built by hand on my own for the Electronic Practice I course.',
    points: [
      'Built and wired the whole unit myself: circuit boards, transformer, heatsinks and output terminals.',
      'Housing is a ready-made metal box that I drilled to fit a front panel with banana-jack terminals, switches and indicator lights.',
    ],
    tech: ['Hardware', 'Analog electronics'],
    narrow: true,
    shots: [
      { src: '/projects/power-supply.jpg', ratio: '720 / 760', alt: 'Inside the power supply: a transformer, circuit boards with ICs and heatsinks', caption: 'Inside the enclosure: transformer, circuit boards and heatsinks' },
    ],
  },
]

const SHAPES: Shape[] = [
  { kind: 'ring', x: 40, y: 3.2, size: 70, color: 2, speed: -200 },
  { kind: 'star', x: 90, y: 3.6, size: 34, color: 4, speed: -120 },
]

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  usePageIntro(root)

  // ไฟวิ่งเฉพาะการ์ดที่มองเห็น: การ์ดที่ถูกใบถัดไปซ้อนทับหรือยังไม่เลื่อนมาถึงจะหยุดไฟไว้ (ช่วยให้เลื่อนลื่น)
  useEffect(() => {
    const cards = [...(root.current?.querySelectorAll<HTMLElement>('.stk') ?? [])]
    let raf = 0
    const update = () => {
      raf = 0
      const rects = cards.map((c) => c.getBoundingClientRect())
      cards.forEach((c, i) => {
        const next = rects[i + 1]
        const covered = next && next.top < rects[i].top + 120 // ใบถัดไปเลื่อนขึ้นมาทับแล้ว
        const onScreen = rects[i].top < innerHeight && rects[i].bottom > 0
        c.classList.toggle('run', onScreen && !covered)
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="page fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />
      <h1 className="title page-title">
        <AnimatedLetters text="Projects" colorful />
      </h1>

      {/* การ์ดแต่ละใบ sticky ไว้ด้านบน ใบถัดไปเลื่อนขึ้นมาทับ เลื่อนกลับก็คลี่ออกเอง (CSS ล้วน) */}
      <div className="stack">
        {projects.map((p, i) => (
          <article
            className="stk"
            key={p.title}
            style={{ '--i': i, '--ic': `var(--c${(i % 5) + 1})` } as CSSProperties}
          >
            <span className="stk-light" aria-hidden="true"><i /></span>
            <header className="stk-head">
              <span className="stk-no">{String(i + 1).padStart(2, '0')}</span>
              <h2>{p.title}</h2>
              {(p.repo || p.live) && (
                <div className="stk-links">
                  {p.repo && <a className="stk-pill" href={p.repo} target="_blank" rel="noreferrer">CODE</a>}
                  {p.live && <a className="stk-pill" href={p.live} target="_blank" rel="noreferrer">LIVE PROJECT</a>}
                </div>
              )}
            </header>

            <div className={`stk-body ${p.shots ? '' : 'one'}`}>
              <div className="stk-text">
                <p className="stk-blurb">{p.blurb}</p>
                <ul>
                  {p.points.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="chips">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>

              {p.shots && (
                <div className="stk-media">
                  {p.carousel ? (
                    <PhoneCarousel slides={p.shots} />
                  ) : (
                    <div
                      className={`shots ${p.twoCols ? 'two' : ''}`}
                      style={p.narrow ? { gridTemplateColumns: 'minmax(0, 420px)' } : undefined}
                    >
                      {p.shots.map((s) => (
                        <figure key={s.src}>
                          <a href={s.src} target="_blank" rel="noreferrer">
                            <img
                              src={s.src}
                              alt={s.alt}
                              loading="lazy"
                              style={s.ratio ? { aspectRatio: s.ratio } : undefined}
                            />
                          </a>
                          <figcaption>{s.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
