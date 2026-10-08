// ตัวจัดการธีมกลาง: ปุ่มในแถบเมนูและ terminal ใช้ร่วมกัน จึงสลับแล้วตรงกันเสมอ
export type Theme = 'warm' | 'night'

export const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'night' ? 'night' : 'warm'

export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next
  try { localStorage.setItem('theme', next) } catch { /* เบราว์เซอร์ไม่ให้เก็บค่า ก็ไม่เป็นไร */ }
  window.dispatchEvent(new CustomEvent('themechange', { detail: next }))
}
