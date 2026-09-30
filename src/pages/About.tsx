import AnimatedLetters from '../components/AnimatedLetters'

const faces = ['Python', 'TypeScript', 'Next.js', 'Firebase', 'OCR', 'Security']

export default function About() {
  return (
    <section className="page about">
      <div>
        <span className="tag">&lt;h1&gt;</span>
        <h1 className="title">
          <AnimatedLetters text="About me" />
        </h1>
        <span className="tag">&lt;/h1&gt;</span>

        <p>
          I’m a 4th-year Electronics and Computer Engineering student at KMUTNB,
          specializing in Computer Engineering, and I’m looking for a cybersecurity internship.
        </p>
        <p>
          I build software in Python and TypeScript, mostly with Next.js and Firebase.
          My senior thesis is an on-premise OCR pipeline that extracts data from Thai tax
          invoices, and I built a sports court booking web app end to end.
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