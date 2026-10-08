import { useRef } from 'react'
import AnimatedLetters from '../components/AnimatedLetters'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro from '../hooks/usePageIntro'
import HoverPreview from '../components/HoverPreview'
import PortraitCutout from '../components/PortraitCutout'

const SHAPES: Shape[] = [
  { kind: 'dot', x: 46, y: 14, size: 20, color: 4, speed: -100 },
  { kind: 'tri', x: 2, y: 84, size: 34, color: 3, speed: -60 },
  { kind: 'plus', x: 47, y: 74, size: 28, color: 5, speed: -150 },
  { kind: 'squig', x: 4, y: 18, size: 90, color: 6, speed: -80 },
]

export default function About() {
  const root = useRef<HTMLElement>(null)
  usePageIntro(root)

  return (
    <section className="page about fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />
      <div>
        <h1 className="title page-title">
          <AnimatedLetters text="About me" colorful />
        </h1>

        <p data-intro>
          I’m Phimlaphat, a 4th-year Electronics and Computer Engineering student at KMUTNB,
          specializing in Computer Engineering.
        </p>
        <p data-intro>
          I learn best by reading a topic until it makes sense and then practicing with
          exercises or old exams. When I really want to remember something, I explain it to
          a friend.
        </p>
        <p data-intro>
          Most of my work so far is software, like a{' '}
          <HoverPreview
            to="/projects"
            title="Sports court booking app"
            desc="Next.js + Firebase, team of 6. Click to see the project."
            image="/projects/booking-form.png"
          >
            booking app
          </HoverPreview>{' '}
          I built with my team and my{' '}
          <HoverPreview
            to="/projects"
            title="Thai tax invoice OCR"
            desc="Senior thesis: Typhoon-OCR + QLoRA, running on-premise. Click to see the project."
            image="/projects/ocr-compare.jpg"
          >
            thesis on reading Thai tax invoices
          </HoverPreview>
          . I’ve also done some hands-on electronics, including a power supply I built myself.
        </p>
        <p data-intro>
          Right now I’m looking for a security internship, in cybersecurity or network security, and I’m studying the
          fundamentals on my own, such as the OWASP Top 10.
        </p>
      </div>

      <PortraitCutout />
    </section>
  )
}
