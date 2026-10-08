import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro from '../hooks/usePageIntro'

// หน้าที่แสดงเมื่อเข้าลิงก์ที่ไม่มีอยู่จริง
const SHAPES: Shape[] = [
  { kind: 'star', x: 6, y: 14, size: 34, color: 4, speed: -60 },
  { kind: 'ring', x: 44, y: 10, size: 64, color: 2, speed: -100 },
  { kind: 'plus', x: 10, y: 84, size: 28, color: 5, speed: -120 },
]

export default function NotFound() {
  const root = useRef<HTMLElement>(null)
  usePageIntro(root)

  return (
    <section className="page hero nf fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />
      <div>
        <h1 className="nf-code page-title" aria-label="404">
          <span className="letter">4</span><span className="letter">0</span><span className="letter">4</span>
        </h1>
        <p className="nf-text" data-intro>This page wandered off. The link may be wrong or the page was moved.</p>
        <div className="hero-actions" data-intro>
          <Link to="/" className="btn btn-fill">BACK TO HOME</Link>
          <Link to="/projects" className="btn">SEE PROJECTS</Link>
        </div>
      </div>
      <div data-reveal="pop">
        <Mascot variant="notfound" />
      </div>
    </section>
  )
}
