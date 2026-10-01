import AnimatedLetters from '../components/AnimatedLetters'
import { COURT_LIVE, COURT_REPO } from '../links'

type Shot = { src: string; alt: string; caption: string }
type Project = {
  title: string
  blurb: string
  points: string[]
  tech: string[]
  shots?: Shot[]
  repo?: string
  live?: string
}

const projects: Project[] = [
  {
    title: 'Sports Court Booking',
    blurb: 'A web app for booking sports courts, built with a team of seven.',
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
      'Python pipeline built around Qwen2.5-VL and Typhoon-OCR.',
      'Designed to run on-premise, for data privacy and to avoid external API costs.',
      'Handles hard cases such as quantity and unit price embedded in the description field.',
    ],
    tech: ['Python', 'Qwen2.5-VL', 'Typhoon-OCR'],
  },
]

export default function Projects() {
  return (
    <section className="page">
      <span className="tag">&lt;h1&gt;</span>
      <h1 className="title">
        <AnimatedLetters text="Projects" />
      </h1>
      <span className="tag">&lt;/h1&gt;</span>

      <div className="proj-list">
        {projects.map((p) => (
          <article className="proj" key={p.title}>
            <h2>{p.title}</h2>
            <p className="proj-blurb">{p.blurb}</p>
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
            {p.shots && (
              <div className="shots">
                {p.shots.map((s) => (
                  <figure key={s.src}>
                    <img src={s.src} alt={s.alt} loading="lazy" />
                    <figcaption>{s.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            {(p.repo || p.live) && (
              <div className="proj-links">
                {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noreferrer">CODE</a>}
                {p.live && <a className="btn" href={p.live} target="_blank" rel="noreferrer">LIVE</a>}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
