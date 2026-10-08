import { useEffect, useRef, useState, type CSSProperties } from 'react'
import AnimatedLetters from '../components/AnimatedLetters'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro, { enter as animIn } from '../hooks/usePageIntro'
import '../skills.css'

type GroupId = 'lang' | 'web' | 'ai' | 'sys' | 'hw'
type Skill = {
  id: string
  group: GroupId
  name: string
  short: string // ตัวย่อในวงกลม
  status: 'core' | 'learning'
  text: string
  usedIn: string[] // งานที่ใช้ทักษะนี้
  links: string[] // id ของทักษะที่เกี่ยวข้อง
}

// หมวดทักษะ: สีของวงในวงโคจร + กล่องใน Toolbox (สีมาจากธีม --c1..--c5)
const groups: { id: GroupId; name: string; color: string; tools: string[] }[] = [
  { id: 'lang', name: 'Languages', color: 'var(--c1)', tools: ['Python', 'TypeScript', 'Dart'] },
  { id: 'web', name: 'Web & Mobile', color: 'var(--c2)', tools: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Flutter', 'Firebase Firestore', 'Jest'] },
  { id: 'ai', name: 'AI & Data', color: 'var(--c3)', tools: ['Typhoon-OCR', 'QLoRA', 'Qwen2.5-VL', 'Ollama', 'Function calling', 'NumPy', 'Streamlit'] },
  { id: 'sys', name: 'Systems & Tools', color: 'var(--c4)', tools: ['Linux', 'SSH (Paramiko)', 'Azure VMs', 'Azure Queue Storage', 'Git & GitHub', 'Vercel'] },
  { id: 'hw', name: 'Hardware', color: 'var(--c5)', tools: ['Analog electronics', 'Circuit assembly'] },
]


const SHAPES: Shape[] = [
  { kind: 'star', x: 1, y: 60, size: 34, color: 5, speed: -80 },
  { kind: 'dot', x: 60, y: 10, size: 18, color: 4, speed: -140 },
  { kind: 'tri', x: 58, y: 88, size: 30, color: 6, speed: -60 },
]

// แก้ข้อความหรือเพิ่มทักษะได้ที่นี่ (วงจะจัดตำแหน่งให้เอง)
const skills: Skill[] = [
  { id: 'python', group: 'lang', name: 'Python', short: 'Py', status: 'core',
    text: 'My main language. It runs the OCR pipeline in my thesis and the NOC Assistant, and I used it with NumPy for coursework labs on genetic algorithms and fuzzy logic.',
    usedIn: ['OCR thesis', 'NOC Assistant', 'Course labs'],
    links: ['ocr', 'llm', 'linux'] },
  { id: 'typescript', group: 'lang', name: 'TypeScript', short: 'TS', status: 'core',
    text: 'Typed React components and props, used in this portfolio and in the Next.js court booking app.',
    usedIn: ['Court booking', 'This portfolio'],
    links: ['react', 'firebase'] },
  { id: 'react', group: 'web', name: 'React & Next.js', short: 'Nx', status: 'core',
    text: 'Next.js with API routes and Tailwind CSS in the court booking app (team of six). React with Vite and React Router in this portfolio.',
    usedIn: ['Court booking', 'This portfolio'],
    links: ['typescript', 'firebase', 'git'] },
  { id: 'flutter', group: 'web', name: 'Flutter', short: 'Fl', status: 'core',
    text: 'MyMood is a Flutter app with a daily habit checklist, a monthly mood calendar and a journal with tag search.',
    usedIn: ['MyMood'],
    links: ['react'] },
  { id: 'firebase', group: 'web', name: 'Firebase', short: 'Fb', status: 'core',
    text: 'Firestore as the database of the court booking app, with transactions so two users cannot book the same slot.',
    usedIn: ['Court booking'],
    links: ['react', 'security'] },
  { id: 'git', group: 'sys', name: 'Git & Vercel', short: 'Git', status: 'core',
    text: 'Version control on GitHub with small commits, and continuous deployment on Vercel. Each branch of this portfolio gets its own preview URL.',
    usedIn: ['This portfolio'],
    links: ['react'] },
  { id: 'ocr', group: 'ai', name: 'OCR & ML', short: 'ML', status: 'core',
    text: 'Fine-tuning Typhoon-OCR 1.5 (2B) with QLoRA to extract 14 fields from Thai tax invoices. Rule checks such as the tax ID checksum flag fields for review before saving.',
    usedIn: ['OCR thesis'],
    links: ['python', 'llm'] },
  { id: 'llm', group: 'ai', name: 'Local LLMs', short: 'AI', status: 'core',
    text: 'Running llama3.2:3b locally with Ollama. Function calling maps a Thai question to a server check, and the model explains the result in plain language.',
    usedIn: ['NOC Assistant'],
    links: ['python', 'ocr', 'linux'] },
  { id: 'linux', group: 'sys', name: 'Linux & Networking', short: 'Lx', status: 'core',
    text: 'Checking and configuring a Linux server over SSH with Paramiko: CPU, memory, interfaces, routes and connections. Also used two Linux VMs with Azure Queue Storage in a cloud course.',
    usedIn: ['NOC Assistant', 'Cloud course'],
    links: ['python', 'llm', 'security'] },
  { id: 'security', group: 'sys', name: 'Cybersecurity', short: 'Sec', status: 'learning',
    text: 'Building the fundamentals for a security internship. Related work so far: PIN-protected admin access and transaction-based booking in the court booking app, and an on-premise design for the OCR thesis.',
    usedIn: ['Court booking', 'OCR thesis'],
    links: ['python', 'firebase', 'linux'] },
  { id: 'electronics', group: 'hw', name: 'Analog Electronics', short: 'El', status: 'core',
    text: 'Built a power supply on my own for Electronic Practice I: assembled the boards, transformer and heatsinks, and fitted terminals, switches and indicators into a drilled metal enclosure.',
    usedIn: ['Electronic Practice I'],
    links: [] },
]

export default function Skills() {
  const [pinned, setPinned] = useState<string | null>(null) // ทักษะที่กดค้างไว้
  const [hover, setHover] = useState<string | null>(null) // ทักษะที่กำลังชี้
  const timer = useRef<number | undefined>(undefined)
  const root = useRef<HTMLElement>(null)

  usePageIntro(root, (q) => {
    // วงโคจรหมุนเข้ามาพร้อมขยาย แล้ววงทักษะเด้งออกมาทีละวง
    animIn(q('.orbit'), { scale: 0.5, rotation: -120, opacity: 0 }, { duration: 1.2, ease: 'back.out(1.4)', delay: 0.2 })
    animIn(q('.label'), { opacity: 0 }, { duration: 0.4, stagger: 0.05, delay: 0.9, clearProps: 'opacity' })
    // กล่อง Toolbox ไหลเข้ามาจากด้านขวาทีละกล่อง
    animIn(q('.tb-box'), { x: 80, opacity: 0 }, { duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 0.6 })
  })

  const shownId = hover ?? pinned
  const current = skills.find((s) => s.id === shownId)

  const enter = (id: string) => {
    window.clearTimeout(timer.current)
    setHover(id)
  }
  // หน่วงนิดหน่อยให้เมาส์เลื่อนจากโหนดไปที่การ์ดได้
  const leave = () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHover(null), 400)
  }
  const clearAll = () => {
    window.clearTimeout(timer.current)
    setHover(null)
    setPinned(null)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && clearAll()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <section className="page fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />
      <h1 className="title page-title">
        <AnimatedLetters text="Skills" colorful />
      </h1>
      <p className="sk-sub" data-intro>Hover a skill to see how I use it. Click to keep it open.</p>
      <ul className="sk-legend" aria-label="Skill groups" data-intro>
        {groups.map((g) => (
          <li key={g.id} style={{ '--g': g.color } as CSSProperties}>{g.name}</li>
        ))}
      </ul>

      <div className="sk-layout">
      <div className="sk-stage">
        <div className={`orbit ${current ? 'has-sel' : ''}`} onClick={clearAll}>
          <div className="ring" />
          <div className="ring inner" />
          <div className="orb" />
          <div className="rotor spin">
            {skills.map((s, i) => (
              <div
                className="slot"
                key={s.id}
                style={{ '--a': `${(360 / skills.length) * i}deg`, '--g': groups.find((g) => g.id === s.group)?.color } as CSSProperties}
              >
                <div className="unspin">
                  <button
                    type="button"
                    className={`node ${shownId === s.id ? 'active' : ''}`}
                    aria-pressed={pinned === s.id}
                    aria-label={s.name}
                    onMouseEnter={() => enter(s.id)}
                    onMouseLeave={leave}
                    onFocus={() => enter(s.id)}
                    onBlur={leave}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPinned(pinned === s.id ? null : s.id)
                    }}
                  >
                    {s.short}
                  </button>
                  <span className="label">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {current && (
          <div
            className="sk-card"
            role="region"
            aria-label={current.name}
            onMouseEnter={() => window.clearTimeout(timer.current)}
            onMouseLeave={leave}
          >
            <div className="sk-top">
              <span className={`sk-badge st-${current.status}`}>{current.status.toUpperCase()}</span>
              <button type="button" className="sk-close" aria-label="Close" onClick={clearAll}>×</button>
            </div>
            <h2>{current.name}</h2>
            <p>{current.text}</p>
            {current.usedIn.length > 0 && (
              <p className="sk-used">
                <b>USED IN</b>
                {current.usedIn.join(' · ')}
              </p>
            )}
            {current.links.length > 0 && (
              <>
            <p className="sk-links-title">CONNECTED SKILLS</p>
            <div className="sk-chips">
              {current.links.map((id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => {
                    setPinned(id)
                    setHover(id)
                  }}
                >
                  {skills.find((s) => s.id === id)?.name} →
                </button>
              ))}
            </div>
              </>
            )}
          </div>
        )}
      </div>

      <section className="sk-section" aria-labelledby="toolbox-title">
        <h2 id="toolbox-title" className="sk-h2" data-intro>Toolbox</h2>
        <p className="sk-note" data-intro>Tools from my projects and coursework, by group.</p>
        <div className={`tb-grid ${current ? 'has-sel' : ''}`}>
          {groups.map((g) => (
            <div
              className={`tb-box ${current?.group === g.id ? 'on' : ''}`}
              key={g.id}
              style={{ '--g': g.color } as CSSProperties}
            >
              <h3>{g.name}</h3>
              <ul>
                {g.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      </div>
    </section>
  )
}
