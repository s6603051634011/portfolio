import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { CV_URL, EMAIL } from '../links'
import { setTheme } from '../theme'
import '../terminal.css'

/* โหมด terminal: กด ` (ปุ่มซ้ายของเลข 1) หรือปุ่ม >_ ในแถบเมนู
   ลากแถบหัวเพื่อย้ายตำแหน่ง (บนคอม) กด – หรือจุดเหลืองเพื่อพับเก็บ จุดเขียวเพื่อกลับตำแหน่งเดิม
   พิมพ์ help เพื่อดูคำสั่ง  กด Esc หรือพิมพ์ exit เพื่อปิด
   แก้ข้อความของแต่ละคำสั่งได้ที่ COMMANDS ด้านล่าง */

const PAGES = ['home', 'about', 'skills', 'projects', 'education', 'contact'] as const

type Line = { id: number; node: ReactNode }

const c = (cls: string, text: ReactNode) => <span className={`tm-${cls}`}>{text}</span>

const COMMANDS: Record<string, { desc: string; out: () => ReactNode }> = {
  help: { desc: 'list commands', out: () => null }, // สร้างตอนเรียก (ดูใน run)
  whoami: {
    desc: 'who I am',
    out: () => <>Phimlaphat Machaopasuwan{'\n'}4th-year Electronics Engineering Technology (Computer), KMUTNB{'\n'}{c('pink', 'Looking for a security internship, in cybersecurity or network security.')}</>,
  },
  projects: {
    desc: 'list my projects',
    out: () => ['Sports Court Booking', 'Thai Tax Invoice OCR (Senior Thesis)', 'NOC Assistant (AI Network Chatbot)', 'MyMood (Mobile App)', 'DIY Power Supply (Electronic Practice I)']
      .map((p, i) => <span key={p}>{c('cyan', `0${i + 1}`)} {p}{'\n'}</span>),
  },
  skills: {
    desc: 'list my skills',
    out: () => <>{c('yellow', 'languages ')} Python  TypeScript  Dart{'\n'}{c('yellow', 'web/mobile')} React  Next.js  Flutter  Firebase{'\n'}{c('yellow', 'ai/data   ')} Typhoon-OCR  QLoRA  Ollama  NumPy{'\n'}{c('yellow', 'systems   ')} Linux  SSH (Paramiko)  Azure  Git  Vercel</>,
  },
  education: {
    desc: 'where I study',
    out: () => <>KMUTNB, Electronics Engineering Technology (Computer) {c('green', '· present')}{'\n'}St.Mary School (Marialai School), Science-Mathematics {c('dim', '· completed')}</>,
  },
  contact: { desc: 'how to reach me', out: () => <>{c('cyan', 'email')}  {EMAIL}{'\n'}{c('dim', 'or type: open contact')}</> },
  cv: { desc: 'download my CV', out: () => null },
  open: { desc: 'go to a page, e.g. open projects (cd works too)', out: () => null },
  theme: { desc: 'theme night | theme day', out: () => null },
  clear: { desc: 'clear the screen', out: () => null },
  exit: { desc: 'close the terminal', out: () => null },
}

export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const [min, setMin] = useState(false) // พับเก็บเป็นแถบเล็ก
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null) // ตำแหน่งที่ลากไปวาง (null = ตำแหน่งเริ่มต้น)
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const minRef = useRef(false)
  useEffect(() => { minRef.current = min }, [min])
  // ปิดหน้าต่าง (เปิดใหม่จะกลับมาแบบกางออก)
  const close = () => { setOpen(false); setMin(false) }
  const input = useRef<HTMLInputElement>(null)
  const out = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const navigate = useNavigate()

  const print = (...nodes: ReactNode[]) =>
    setLines((ls) => [...ls, ...nodes.map((node) => ({ id: nextId.current++, node }))])

  // เปิด/ปิดด้วยปุ่ม ` (ไม่ทำงานตอนกำลังพิมพ์ในช่องกรอกอื่น) และปุ่ม >_ ในแถบเมนู
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
      if (e.key === '`' && (!typing || t === input.current)) {
        e.preventDefault()
        toggle()
      } else if (e.key === 'Escape') { setOpen(false); setMin(false) }
    }
    // ถ้าพับเก็บอยู่ ให้กางออก ถ้าไม่ได้พับ ให้เปิด/ปิด
    const toggle = () => {
      if (minRef.current) { setMin(false); setOpen(true) } else setOpen((o) => !o)
    }
    const onToggle = () => toggle()
    window.addEventListener('keydown', onKey)
    window.addEventListener('terminal-toggle', onToggle)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('terminal-toggle', onToggle)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    if (lines.length === 0) {
      setLines([{ id: nextId.current++, node: <>Welcome, guest. Type {c('yellow', 'help')} to see commands, {c('yellow', 'exit')} or {c('yellow', 'Esc')} to close.</> }])
    }
    if (!min) input.current?.focus()
  }, [open, min, lines.length])

  // ลากหน้าต่างด้วยแถบหัว (เฉพาะเมาส์ บนจอสัมผัสจะอยู่ด้านล่างจอเหมือนเดิม)
  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || (e.target as HTMLElement).closest('button')) return
    const r = box.current!.getBoundingClientRect()
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }
  const onDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !box.current) return
    const r = box.current.getBoundingClientRect()
    const x = Math.min(Math.max(8, e.clientX - drag.current.dx), innerWidth - r.width - 8)
    const y = Math.min(Math.max(8, e.clientY - drag.current.dy), innerHeight - 48)
    setPos({ x, y })
  }
  const endDrag = () => { drag.current = null }

  // ย่อขนาดหน้าต่างเบราว์เซอร์แล้วหน้าต่างไม่หลุดจอ
  useEffect(() => {
    if (!pos) return
    const keep = () => setPos((p) => p && ({
      x: Math.min(p.x, Math.max(8, innerWidth - (box.current?.offsetWidth ?? 300) - 8)),
      y: Math.min(p.y, innerHeight - 48),
    }))
    window.addEventListener('resize', keep)
    return () => window.removeEventListener('resize', keep)
  }, [pos])

  useEffect(() => {
    out.current?.scrollTo({ top: out.current.scrollHeight })
  }, [lines])

  const run = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return
    setHistory((h) => [cmd, ...h].slice(0, 30))
    setHIndex(-1)
    print(<>{c('green', 'guest@phimlaphat:~$')} {cmd}</>)
    const [name, arg] = cmd.toLowerCase().split(/\s+/)

    if (name === 'help') {
      print(Object.entries(COMMANDS).map(([k, v]) => <span key={k}>{c('yellow', k.padEnd(10))} {c('dim', v.desc)}{'\n'}</span>))
    } else if (name === 'clear') {
      setLines([])
    } else if (name === 'exit') {
      close()
    } else if (name === 'cv') {
      const a = document.createElement('a')
      a.href = CV_URL
      a.download = ''
      a.click()
      print(<>downloading {CV_URL.split('/').pop()} … {c('green', 'done')}</>)
    } else if (name === 'theme') {
      if (arg === 'night' || arg === 'day') {
        setTheme(arg === 'night' ? 'night' : 'warm')
        print(<>theme set to {c('yellow', arg)}</>)
      } else print(<>usage: theme night | theme day</>)
    } else if (name === 'open' || name === 'cd') {
      const page = arg === '~' || arg === '..' ? 'home' : arg
      if (page && (PAGES as readonly string[]).includes(page)) {
        navigate(page === 'home' ? '/' : `/${page}`)
        print(<>opening {c('cyan', page)} …</>)
      } else print(<>usage: open {PAGES.join(' | ')}</>)
    } else if (COMMANDS[name]) {
      print(COMMANDS[name].out())
    } else {
      print(<>command not found: {cmd} {c('dim', '(type help)')}</>)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(hIndex + 1, history.length - 1)
      setHIndex(i)
      setValue(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(Math.max(i, -1))
      setValue(i >= 0 ? history[i] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault() // เติมคำสั่งให้อัตโนมัติ
      const hit = Object.keys(COMMANDS).find((k) => k.startsWith(value.trim().toLowerCase()))
      if (hit && value.trim()) setValue(hit)
    }
  }

  if (!open) return null

  if (min) {
    return (
      <button type="button" className="tm-pill" onClick={() => setMin(false)} aria-label="Open terminal">
        <span className="tm-green">&gt;_</span> guest@phimlaphat
      </button>
    )
  }

  return (
    <div
      ref={box}
      className={`tm ${pos ? 'moved' : ''}`}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      role="dialog"
      aria-label="Terminal"
      aria-modal="false"
      onClick={() => input.current?.focus()}
    >
      <div className="tm-bar" onPointerDown={startDrag} onPointerMove={onDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <span className="tm-dots">
          <button type="button" aria-label="Close terminal" title="Close" onClick={close} />
          <button type="button" aria-label="Minimize terminal" title="Minimize" onClick={() => setMin(true)} />
          <button type="button" aria-label="Reset position" title="Reset position" onClick={() => setPos(null)} />
        </span>
        <span className="tm-title">guest@phimlaphat: ~</span>
        <button type="button" className="tm-close" aria-label="Minimize terminal" title="Minimize" onClick={() => setMin(true)}>–</button>
        <button type="button" className="tm-close" aria-label="Close terminal" title="Close" onClick={close}>✕</button>
      </div>
      <div className="tm-out" ref={out} aria-live="polite">
        {lines.map((l) => (
          <div key={l.id} className="tm-line">{l.node}</div>
        ))}
      </div>
      <label className="tm-in">
        <span className="tm-green">guest@phimlaphat:~$</span>
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </label>
    </div>
  )
}
