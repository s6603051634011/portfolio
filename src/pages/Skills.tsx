import { useEffect, useState, type CSSProperties } from 'react'
import AnimatedLetters from '../components/AnimatedLetters'
import '../skills.css'

type Skill = {
  id: string
  name: string
  short: string // ตัวย่อในวงกลม
  status: 'core' | 'learning'
  text: string
  links: string[] // id ของทักษะที่เกี่ยวข้อง
}

// แก้ข้อความหรือเพิ่มทักษะได้ที่นี่ (วงจะจัดตำแหน่งให้เอง)
const skills: Skill[] = [
  { id: 'python', name: 'Python', short: 'Py', status: 'core',
    text: 'The language I use most. In my thesis it runs the OCR model, validates extracted fields and handles the data.',
    links: ['ocr', 'security'] },
  { id: 'typescript', name: 'TypeScript', short: 'TS', status: 'core',
    text: 'Typed code for my web projects, including the court booking app and this portfolio.',
    links: ['react', 'firebase'] },
  { id: 'react', name: 'React & Next.js', short: 'Nx', status: 'core',
    text: 'Next.js for the court booking app (team of seven) and React with Vite for this portfolio.',
    links: ['typescript', 'firebase', 'git'] },
  { id: 'firebase', name: 'Firebase', short: 'Fb', status: 'core',
    text: 'Firestore for bookings, using transactions so two people can’t book the same slot.',
    links: ['react', 'security'] },
  { id: 'ocr', name: 'OCR & ML', short: 'ML', status: 'core',
    text: 'Fine-tuning Typhoon-OCR 1.5 (2B) with QLoRA to read 14 fields from Thai tax invoices, running on-premise.',
    links: ['python'] },
  { id: 'security', name: 'Cybersecurity', short: 'Sec', status: 'learning',
    text: 'Building a foundation from the ground up: how systems break, and how to build them so they don’t. I’m looking for an internship here.',
    links: ['python', 'firebase'] },
  { id: 'git', name: 'Git & Vercel', short: 'Git', status: 'core',
    text: 'Every change to this portfolio is committed to GitHub and deployed on Vercel.',
    links: ['react'] },
]

export default function Skills() {
  const [sel, setSel] = useState<string | null>(null)
  const current = skills.find((s) => s.id === sel)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSel(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section className="page">
      <h1 className="title">
        <AnimatedLetters text="Skills" />
      </h1>
      <p className="sk-sub">Click a node to see how I use it. The orbit pauses while you look.</p>

      <div className="sk-stage">
        <div className={`orbit ${sel ? 'has-sel' : ''}`} onClick={() => setSel(null)}>
          <div className="ring" />
          <div className="ring inner" />
          <div className="core" />
          <div className="rotor spin">
            {skills.map((s, i) => (
              <div
                className="slot"
                key={s.id}
                style={{ '--a': `${(360 / skills.length) * i}deg` } as CSSProperties}
              >
                <div className="unspin">
                  <button
                    type="button"
                    className={`node ${sel === s.id ? 'active' : ''}`}
                    aria-pressed={sel === s.id}
                    aria-label={s.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSel(sel === s.id ? null : s.id)
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
          <div className="sk-card" role="region" aria-label={current.name}>
            <div className="sk-top">
              <span className={`sk-badge ${current.status}`}>{current.status.toUpperCase()}</span>
              <button type="button" className="sk-close" aria-label="Close" onClick={() => setSel(null)}>×</button>
            </div>
            <h2>{current.name}</h2>
            <p>{current.text}</p>
            <p className="sk-links-title">CONNECTED SKILLS</p>
            <div className="sk-chips">
              {current.links.map((id) => (
                <button type="button" key={id} onClick={() => setSel(id)}>
                  {skills.find((s) => s.id === id)?.name} →
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
