import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Loader from './components/Loader'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <Loader />}
      <Sidebar />
      <main>
        <span className="tag top">&lt;body&gt;</span>
        {!loading && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        )}
        <span className="tag bottom">&lt;/body&gt;</span>
      </main>
    </>
  )
}