import type { ReactNode } from 'react'
import AnimatedLetters from '../components/AnimatedLetters'
import '../education.css'

type Item = {
  title: string
  place: string
  status: 'present' | 'completed'
  period?: string // ใส่ช่วงเวลาเองได้ เช่น '2023 – Present'
  text: string
}

// เพิ่มการ์ดใหม่ได้โดยคัดลอกก้อน { ... } แล้วแก้ข้อความ
const experience: Item[] = [
  {
    title: 'Senior Thesis: Thai Tax Invoice OCR',
    place: 'KMUTNB · two-person thesis',
    status: 'present', // เปลี่ยนเป็น 'completed' เมื่อเสร็จแล้ว
    text: 'Building a Python pipeline with Typhoon-OCR 1.5 (2B) that extracts structured data from Thai tax invoices, designed to run on-premise.',
  },
  {
    title: 'Sports Court Booking Web App',
    place: 'Team project · 7 people',
    status: 'completed',
    text: 'Booking app with Next.js and Firebase: a 15-minute payment window, Firestore transactions to prevent double booking, and a staff dashboard.',
  },
]

const education: Item[] = [
  {
    title: 'Electronics Engineering Technology (Computer)',
    place: "King Mongkut's University of Technology North Bangkok (KMUTNB), College of Industrial Technology",
    status: 'present',
    period: 'Electronics Engineering Technology (Computer) · 4th year',
    text: 'Specializing in Computer Engineering, with hands-on software projects and a focus on cybersecurity.',
  },
  {
    title: 'High School Diploma (Science-Mathematics Program)',
    place: "St.Mary School",
    status: 'completed',
    period: 'Science-Mathematics Program',
    text: 'Focused on advanced mathematics and science, with a strong interest in computer programming and technology.',
  },
]

const Briefcase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" />
  </svg>
)
const Book = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" /><path d="M5 17a3 3 0 0 1 3-3h11" />
  </svg>
)

function Column({ label, icon, items }: { label: string; icon: ReactNode; items: Item[] }) {
  return (
    <div>
      <div className="col-head">
        {icon}
        <h2>{label}</h2>
      </div>
      <div className="timeline">
        {items.map((it) => (
          <div className="t-item" key={it.title}>
            <article className="t-card">
              <div className="t-icon">{icon}</div>
              <div>
                <div className="t-top">
                  <h3>{it.title}</h3>
                  <span className={`badge ${it.status === 'completed' ? 'done' : ''}`}>{it.status}</span>
                </div>
                <p className="t-place">{it.place}</p>
                {it.period && <p className="t-period">{it.period}</p>}
                <p className="t-text">{it.text}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Education() {
  return (
    <section className="page">
      <h1 className="bg-title">
        <AnimatedLetters text="Education & " />
        <AnimatedLetters text="Experience." className="accent" />
      </h1>
      <p className="bg-sub">A journey of learning and building.</p>

      <div className="bg-grid">
        <Column label="Experience" icon={<Briefcase />} items={experience} />
        <Column label="Education" icon={<Book />} items={education} />
      </div>
    </section>
  )
}
