import { useRef } from 'react'
import { Link } from 'react-router-dom'
import AnimatedLetters from '../components/AnimatedLetters'
import Mascot from '../components/Mascot'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro from '../hooks/usePageIntro'
import useMagnetic from '../hooks/useMagnetic'
import Typewriter from '../components/Typewriter'
import { CV_URL } from '../links'

const SHAPES: Shape[] = [
  { kind: 'star', x: 2, y: 16, size: 36, color: 4, speed: -60 },
  { kind: 'ring', x: 42, y: 16, size: 70, color: 2, speed: -120 },
  { kind: 'dot', x: 46, y: 82, size: 22, color: 3, speed: -90 },
  { kind: 'plus', x: 8, y: 88, size: 30, color: 5, speed: -140 },
  { kind: 'squig', x: 92, y: 18, size: 90, color: 6, speed: -70 },
]

// บทบาทที่พิมพ์วนทีละอัน แต่ละอันมีสีของตัวเอง
const ROLES = [
  { text: 'Computer Engineering student', color: 'var(--c2)' },
  { text: 'Security intern candidate', color: 'var(--c1)' },
  { text: 'Full-stack developer', color: 'var(--c3)' },
]

export default function Home() {
  const root = useRef<HTMLElement>(null)
  usePageIntro(root)
  const actions = useRef<HTMLDivElement>(null)
  useMagnetic(actions)

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
        <div data-intro>
          <Typewriter items={ROLES} className="role" />
        </div>
        <div className="hero-actions" data-intro ref={actions}>
          <Link to="/contact" className="btn mag">CONTACT ME</Link>
          <a href={CV_URL} className="btn btn-fill mag" download>DOWNLOAD CV</a>
        </div>
      </div>
      <div data-reveal="pop">
        <Mascot />
      </div>
    </section>
  )
}
