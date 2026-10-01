import AnimatedLetters from '../components/AnimatedLetters'
import HoverPreview from '../components/HoverPreview'

const faces = ['Python', 'TypeScript', 'Next.js', 'Firebase', 'OCR', 'Security']

export default function About() {
  return (
    <section className="page about">
      <div>
        <span className="tag">&lt;h1&gt;</span>
        <h1 className="title">
          <AnimatedLetters text="About me" colorful />
        </h1>
        <span className="tag">&lt;/h1&gt;</span>

        <p>
          I’m a 4th-year Electronics and Computer Engineering student at KMUTNB,
          specializing in Computer Engineering, and I’m looking for a cybersecurity internship.
        </p>
        <p>
          I build software in Python and TypeScript, mostly with Next.js and Firebase.
          My senior thesis is an{' '}
          <HoverPreview
            to="/projects"
            title="Thai tax invoice OCR"
            desc="Senior thesis: Typhoon-OCR + QLoRA, running on-premise. Click to see the project."
            image="/projects/ocr-compare.jpg"
          >
            on-premise OCR pipeline
          </HoverPreview>{' '}
          that extracts data from Thai tax invoices, and I worked with a team of seven on a{' '}
          <HoverPreview
            to="/projects"
            title="Sports court booking app"
            desc="Next.js + Firebase, team of 7. Click to see the project."
            image="/projects/booking-form.png"
          >
            sports court booking web app
          </HoverPreview>
          .
        </p>
        <p>
          I’m learning security from the ground up: how systems break, and how to build
          them so they don’t.
        </p>
      </div>

      <div className="stage" aria-label={`Skills: ${faces.join(', ')}`}>
        <div className="cube">
          {faces.map((f) => (
            <div key={f}>{f}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
