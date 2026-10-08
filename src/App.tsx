import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import MascotGuide from './components/MascotGuide'
import Loader from './components/Loader'
import Terminal from './components/Terminal'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Education from './pages/Education'
import NotFound from './pages/NotFound'
// หน้า Contact มีแผนที่ (Leaflet) ขนาดใหญ่ จึงโหลดแยกเฉพาะตอนเปิดหน้านี้
const Contact = lazy(() => import('./pages/Contact'))
import './projects.css'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600) // แสดงตัวโหลดสั้นๆ ไม่ให้คนรอนาน
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      {!loading && <MascotGuide />}
      <Terminal />
      <main>
        {!loading && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Suspense fallback={null}><Contact /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
    </>
  )
}
