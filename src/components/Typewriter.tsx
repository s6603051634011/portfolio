import { useEffect, useState } from 'react'

type Item = { text: string; color: string }

/* พิมพ์ข้อความทีละตัว ลบ แล้วพิมพ์ข้อความถัดไปวนไปเรื่อยๆ
   โปรแกรมอ่านหน้าจอจะอ่านทุกข้อความครบในครั้งเดียว (sr-only)
   ผู้ใช้ที่ปิดแอนิเมชันในระบบจะเห็นทุกข้อความเรียงกันแบบนิ่ง */
export default function Typewriter({ items, className = '' }: { items: Item[]; className?: string }) {
  const [still] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [i, setI] = useState(0) // ข้อความที่เท่าไร
  const [n, setN] = useState(0) // พิมพ์ไปกี่ตัวแล้ว
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (still) return
    const full = items[i].text
    let wait = deleting ? 28 : 60
    if (!deleting && n === full.length) wait = 1600 // ค้างไว้ให้อ่านก่อนลบ
    if (deleting && n === 0) wait = 350
    const t = window.setTimeout(() => {
      if (!deleting && n === full.length) setDeleting(true)
      else if (deleting && n === 0) { setDeleting(false); setI((i + 1) % items.length) }
      else setN(n + (deleting ? -1 : 1))
    }, wait)
    return () => window.clearTimeout(t)
  }, [still, items, i, n, deleting])

  const all = items.map((it) => it.text).join(' / ')

  if (still) {
    return (
      <p className={className}>
        {items.map((it, k) => (
          <span key={it.text}>{k > 0 && <span className="role-sep"> / </span>}<span className="role-item" style={{ color: it.color }}>{it.text}</span></span>
        ))}
      </p>
    )
  }

  return (
    <p className={`${className} tw`}>
      <span className="sr-only">{all}</span>
      <span aria-hidden="true">
        <span className="role-item" style={{ color: items[i].color }}>{items[i].text.slice(0, n)}</span>
        <span className="tw-cur" />
      </span>
    </p>
  )
}
