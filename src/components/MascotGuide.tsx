import { useLocation } from 'react-router-dom'
import Mascot, { type Variant } from './Mascot'

// มาสคอตมุมขวาล่างของทุกหน้า (ยกเว้น Home ที่มีตัวใหญ่อยู่แล้ว) เปลี่ยนอุปกรณ์ตามหน้า
const byPath: Record<string, Variant> = {
  '/about': 'about', // โบกมือ
  '/skills': 'skills', // แว่นตา
  '/projects': 'projects', // แล็ปท็อป
  '/education': 'education', // หมวกรับปริญญา
  '/contact': 'contact', // หูฟังพร้อมไมค์
}

export default function MascotGuide() {
  const { pathname } = useLocation()
  const variant = byPath[pathname]
  if (!variant) return null
  return <Mascot key={variant} variant={variant} floating />
}
