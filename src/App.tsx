import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <>
      <Sidebar />
      <main>
        <span className="tag top">&lt;body&gt;</span>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <span className="tag bottom">&lt;/body&gt;</span>
      </main>
    </>
  )
}