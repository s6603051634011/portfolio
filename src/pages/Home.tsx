import { useRef } from 'react'
import { Link } from 'react-router-dom'
import AnimatedLetters from '../components/AnimatedLetters'
import Mascot from '../components/Mascot'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro from '../hooks/usePageIntro'

const SHAPES: Shape[] = [
  { kind: 'star', x: 2, y: 16, size: 36, color: 4, speed: -60 },
  { kind: 'ring', x: 42, y: 16, size: 70, color: 2, speed: -120 },
  { kind: 'dot', x: 46, y: 82, size: 22, color: 3, speed: -90 },
  { kind: 'plus', x: 8, y: 88, size: 30, color: 5, speed: -140 },
  { kind: 'squig', x: 92, y: 18, size: 90, color: 6, speed: -70 },
]

// แต่ละบทบาทได้สีของตัวเอง
const ROLES = ['Computer Engineering student', 'Cybersecurity intern candidate', 'Full-stack developer']

export default function Home() {
  const root = useRef<HTMLElement>(null)
  usePageIntro(root)

  return (
    <section className="page hero fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />
      <div>
        <h1 className="page-title">
          <AnimatedLetters text="Hi," />
          <br />
          <AnimatedLetters text="I’m " />
          <AnimatedLetters text="Phimlaphat" className="accent" colorful />
          <br />
          <AnimatedLetters text="developer." className="sub" />
        </h1>
        <p className="role" data-intro>
          {ROLES.map((r, i) => (
            <span key={r}>
              {i > 0 && <span className="role-sep"> / </span>}
              <span className="role-item" style={{ color: `var(--c${i + 2})` }}>{r}</span>
            </span>
          ))}
        </p>
        <Link to="/contact" className="btn" data-intro>CONTACT ME</Link>
      </div>
      <div data-reveal="pop">
        <Mascot />
      </div>
    </section>
  )
}
