import { Link } from 'react-router-dom'
import AnimatedLetters from '../components/AnimatedLetters'
import Mascot from '../components/Mascot'

export default function Home() {
  return (
    <section className="page hero">
      <div>
        <h1>
          <AnimatedLetters text="Hi," />
          <br />
          <AnimatedLetters text="I’m " />
          <AnimatedLetters text="Phimlaphat" className="accent" colorful />
          <br />
          <AnimatedLetters text="developer." className="sub" />
        </h1>
        <p className="role">
          Computer Engineering student / Cybersecurity intern candidate / Full-stack developer
        </p>
        <Link to="/contact" className="btn">CONTACT ME</Link>
      </div>
      <Mascot />
    </section>
  )
}
