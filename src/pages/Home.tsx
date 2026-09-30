import { Link } from 'react-router-dom'
import AnimatedLetters from '../components/AnimatedLetters'
import Logo from '../components/Logo'

export default function Home() {
  return (
    <section className="page hero">
      <div>
        <span className="tag">&lt;h1&gt;</span>
        <h1>
          <AnimatedLetters text="Hi," />
          <br />
          <AnimatedLetters text="I’m " />
          <AnimatedLetters text="Phimlaphat" className="yellow" />
          <br />
          <AnimatedLetters text="developer." className="sub" />
        </h1>
        <p className="role">
          Computer Engineering student / Cybersecurity intern candidate / Full-stack developer
        </p>
        <Link to="/contact" className="btn">CONTACT ME</Link>
      </div>
      <Logo />
    </section>
  )
}