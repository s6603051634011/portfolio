import AnimatedLetters from '../components/AnimatedLetters'
import HoverPreview from '../components/HoverPreview'
import PortraitCutout from '../components/PortraitCutout'

export default function About() {
  return (
    <section className="page about">
      <div>
        <h1 className="title">
          <AnimatedLetters text="About me" colorful />
        </h1>

        <p>
          I’m Phimlaphat, a 4th-year Electronics and Computer Engineering student at KMUTNB,
          specializing in Computer Engineering.
        </p>
        <p>
          I learn best by reading a topic until it makes sense and then practicing with
          exercises or old exams. When I really want to remember something, I explain it to
          a friend.
        </p>
        <p>
          Most of my work so far is software, like a{' '}
          <HoverPreview
            to="/projects"
            title="Sports court booking app"
            desc="Next.js + Firebase, team of 7. Click to see the project."
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
        <p>
          Right now I’m looking for a cybersecurity internship, and I’m studying the
          fundamentals on my own, such as the OWASP Top 10.
        </p>
      </div>

      <PortraitCutout />
    </section>
  )
}
