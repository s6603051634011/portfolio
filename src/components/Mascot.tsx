import { useEffect, useId, useRef, useState } from 'react'
import '../mascot.css'

/* ปรับจากคอมโพเนนต์ตัวอย่าง: ตัวการ์ตูน SVG ที่หันหน้าตามเมาส์ กะพริบตา
   และพูดเมื่อคลิก เปลี่ยนเป็นตัวละครผู้หญิง และใช้สีตามธีมของเว็บ */

export type Variant = 'home' | 'about' | 'skills' | 'projects' | 'education' | 'contact'

const POKED = 'Okay, you can stop poking me :)'
const LINES: Record<Variant, string[]> = {
  home: [
    'Hi, I’m Phimlaphat!',
    'Looking for a cybersecurity internship.',
    'Take a look at my projects!',
    POKED,
  ],
  about: ['Hi! Nice to meet you.', 'I’m in my 4th year at KMUTNB.', POKED],
  skills: ['Hover a skill to see how I use it.', 'The orbit pauses while you read.', POKED],
  projects: ['Scroll down: each project stacks on the last.', 'Click a screenshot to open it full size.', POKED],
  education: ['4th year, Computer Engineering at KMUTNB.', 'Looking for a cybersecurity internship.', POKED],
  contact: ['Send a message and it lands in my inbox.', 'I’m looking for a cybersecurity internship.', POKED],
}

const SKIN = '#f7cfb0'
const HAIR = '#2e1b14'

/* ---- การหันหน้า: ชั้นที่อยู่ไกลคอเลื่อนมากกว่า ให้ดูเหมือนหันศีรษะ ---- */
function aim(px: number, py: number, cx: number, cy: number, rx: number, ry: number) {
  const sat = (v: number) => v / Math.sqrt(1 + v * v)
  return [sat((px - cx) / rx), sat((py - cy) / ry)]
}
function approach(cur: number, target: number, dt: number, rate: number) {
  return target + (cur - target) * Math.exp(-rate * dt)
}
function pose(x: number, y: number, near: number) {
  return {
    body: { dx: x * 4, dy: 0 },
    head: { dx: x * 10, dy: y * 7, rot: x * 4 },
    ears: { dx: -x * 7, dy: -y * 3, lead: 1 + x * 0.16, trail: 1 - x * 0.16 },
    hair: { dx: x * 13, dy: y * 4 },
    blush: { dx: x * 20, dy: y * 14 },
    face: { dx: x * 28, dy: y * (y < 0 ? 11 : 20) },
    nose: { dx: x * 10, dy: y * 7 },
    eyes: { dx: x * 4, dy: y * 4, scale: 1 + near * 0.14 },
    brows: { dx: x * 3, dy: y * 2 + Math.min(0, y) * 3 - near * 9 },
  }
}
function blink(since: number) {
  const d = 0.15
  if (since < 0 || since > d) return 1
  return 1 - Math.sin((Math.PI * since) / d) * 0.92
}

type LayerKey =
  | 'hairBack' | 'body' | 'head' | 'earL' | 'earR' | 'hair'
  | 'blush' | 'face' | 'nose' | 'eyes' | 'brows'

export default function Mascot({ variant = 'home', floating = false }: { variant?: Variant; floating?: boolean }) {
  const lines = LINES[variant]
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => n + uid
  const u = (n: string) => `url(#${id(n)})`

  const btnRef = useRef<HTMLButtonElement>(null)
  const layers = useRef<Partial<Record<LayerKey, SVGGElement | null>>>({})
  const set = (k: LayerKey) => (el: SVGGElement | null) => {
    layers.current[k] = el
  }

  const [happy, setHappy] = useState(false)
  const [said, setSaid] = useState(-1)
  const happyTimer = useRef<number | undefined>(undefined)

  const poke = () => {
    setSaid((n) => (n + 1) % lines.length)
    setHappy(true)
    window.clearTimeout(happyTimer.current)
    happyTimer.current = window.setTimeout(() => setHappy(false), 2200)
  }
  useEffect(() => () => window.clearTimeout(happyTimer.current), [])

  // ลูปแอนิเมชัน: เขียนค่าลง SVG ตรงๆ ไม่ผ่าน state จะได้ไม่ re-render 60 ครั้ง/วินาที
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const L = layers.current

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let still = mq.matches
    const onMq = () => (still = mq.matches)
    mq.addEventListener('change', onMq)

    let px = 0, py = 0, lastMove = -1e9
    let gx = 0, gy = 0, near = 0
    let prev = performance.now()
    let nextBlink = prev + 1800
    let blinkAt = -1e9
    let raf = 0
    let visible = true

    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      lastMove = performance.now()
    }
    const onLeave = () => (lastMove = -1e9)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    const tr = (dx: number, dy: number) => `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now

      const r = btn.getBoundingClientRect()
      const cx = r.left + r.width * 0.5
      const cy = r.top + r.height * 0.48
      let tx = 0, ty = 0, tn = 0
      const idle = now - lastMove > 3500
      if (!idle) {
        const reach = Math.max(innerWidth, innerHeight)
        const a = aim(px, py, cx, cy, reach * 0.3, reach * 0.26)
        tx = a[0]
        ty = a[1]
        tn = Math.max(0, 1 - Math.hypot(px - cx, py - cy) / (r.width * 0.45))
      } else if (!still) {
        const t = now / 1000 // ไม่มีใครอยู่: มองไปรอบๆ เอง
        tx = Math.sin(t * 0.45) * 0.55 + Math.sin(t * 1.1) * 0.1
        ty = Math.sin(t * 0.31 + 1) * 0.25
      }

      const rate = still ? 30 : 7
      gx = approach(gx, tx, dt, rate)
      gy = approach(gy, ty, dt, rate)
      near = approach(near, tn, dt, 8)
      const p = pose(gx, gy, near)
      const breathe = still ? 0 : Math.sin(now / 620) * 1.6

      if (!still && now > nextBlink) {
        blinkAt = now
        nextBlink = now + (Math.random() < 0.2 ? 260 : 2200 + Math.random() * 3200)
      }
      const open = still ? 1 : blink((now - blinkAt) / 1000)

      const headT = `${tr(p.head.dx, p.head.dy + breathe)} rotate(${p.head.rot.toFixed(2)} 300 560)`
      L.hairBack?.setAttribute('transform', headT)
      L.head?.setAttribute('transform', headT)
      L.body?.setAttribute('transform', tr(p.body.dx, p.body.dy + breathe * 0.4))
      L.earL?.setAttribute('transform', `${tr(p.ears.dx, p.ears.dy)} translate(138 380) scale(${p.ears.lead.toFixed(3)} 1) translate(-138 -380)`)
      L.earR?.setAttribute('transform', `${tr(p.ears.dx, p.ears.dy)} translate(462 380) scale(${p.ears.trail.toFixed(3)} 1) translate(-462 -380)`)
      L.hair?.setAttribute('transform', tr(p.hair.dx, p.hair.dy))
      L.blush?.setAttribute('transform', tr(p.blush.dx, p.blush.dy))
      L.face?.setAttribute('transform', tr(p.face.dx, p.face.dy))
      L.nose?.setAttribute('transform', tr(p.nose.dx, p.nose.dy))
      L.brows?.setAttribute('transform', tr(p.brows.dx, p.brows.dy))
      L.eyes?.setAttribute(
        'transform',
        `${tr(p.eyes.dx, p.eyes.dy)} translate(300 350) scale(${p.eyes.scale.toFixed(3)} ${(p.eyes.scale * open).toFixed(3)}) translate(-300 -350)`,
      )
    }
    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      prev = performance.now()
    })
    io.observe(btn)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      mq.removeEventListener('change', onMq)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  const greeting = said >= 0 ? lines[said] : lines[0]
  const shirt = { fill: 'var(--accent)' }

  return (
    <button ref={btnRef} type="button" className={`mc ${floating ? 'mc-float' : ''}`} onClick={poke} aria-label="Say hi to the character">
      <svg viewBox="0 0 600 720" aria-hidden="true">
        <defs>
          <radialGradient id={id('shade')} cx="46%" cy="40%" r="62%">
            <stop offset="0.55" stopColor="#7a2e14" stopOpacity="0" />
            <stop offset="1" stopColor="#7a2e14" stopOpacity="0.34" />
          </radialGradient>
          <radialGradient id={id('hi')} cx="36%" cy="30%" r="42%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id('blush')}>
            <stop offset="0" stopColor="#ff6f6f" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff6f6f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id('eye')} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#3a3a3c" />
            <stop offset="1" stopColor="#050505" />
          </radialGradient>
          <radialGradient id={id('nose')} cx="42%" cy="36%" r="66%">
            <stop offset="0" stopColor="#ff9c82" stopOpacity="0.18" />
            <stop offset="1" stopColor="#b8583a" stopOpacity="0.42" />
          </radialGradient>
          <linearGradient id={id('neck')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b2a14" stopOpacity="0.45" />
            <stop offset="0.5" stopColor="#6b2a14" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id={id('cloth')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id={id('hairlit')} cx="38%" cy="22%" r="80%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.3" />
          </radialGradient>
          <clipPath id={id('mouth')}>
            <path d="M218 440 Q300 458 382 440 Q376 524 300 530 Q224 524 218 440 Z" />
          </clipPath>
          <clipPath id={id('arch')}>
            <path d="M14 720 V340 C14 170 150 54 300 54 C450 54 586 170 586 340 V720 Z" />
          </clipPath>
        </defs>

        {/* ฉากหลังทรงโค้งสีตามธีม ตัวละครถูกตัดที่ขอบโค้งนี้ */}
        <path d="M14 720 V340 C14 170 150 54 300 54 C450 54 586 170 586 340 V720 Z" style={{ fill: 'var(--accent-shadow)' }} />

        <g clipPath={u('arch')}>
          {/* ผมด้านหลัง (อยู่หลังคอและไหล่) */}
          <g ref={set('hairBack')}>
            <path d="M112 330 C96 520 88 640 118 730 L482 730 C512 640 504 520 488 330 Z" fill={HAIR} />
          </g>

          <g ref={set('body')}>
            <path d="M28 730 C40 646 104 604 206 588 L394 588 C496 604 560 646 572 730 Z" style={shirt} />
            <path d="M28 730 C40 646 104 604 206 588 L394 588 C496 604 560 646 572 730 Z" fill={u('cloth')} />
            <path d="M246 500 L354 500 L360 600 Q300 624 240 600 Z" fill={SKIN} />
            <path d="M246 500 L354 500 L360 600 Q300 624 240 600 Z" fill={u('neck')} />
            {/* ปกเสื้อโปโล */}
            <path d="M236 566 Q262 604 300 628 L250 668 Q214 628 194 594 Z" style={shirt} />
            <path d="M364 566 Q338 604 300 628 L350 668 Q386 628 406 594 Z" style={shirt} />
            <path d="M236 566 Q262 604 300 628 L250 668 Q214 628 194 594 Z M364 566 Q338 604 300 628 L350 668 Q386 628 406 594 Z" fill="#fff" opacity="0.12" stroke="#000" strokeOpacity="0.4" strokeWidth="2" />
            <rect x="288" y="628" width="24" height="102" fill="#fff" opacity="0.08" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />
            <circle cx="300" cy="656" r="6" fill="#2a2a2c" stroke="#000" strokeOpacity="0.5" />
            <circle cx="300" cy="698" r="6" fill="#2a2a2c" stroke="#000" strokeOpacity="0.5" />
            {/* ปอยผมพาดหน้าไหล่ */}
            <path d="M142 470 C118 560 120 650 140 730 L196 730 C186 640 196 560 226 506 Z" fill={HAIR} />
            <path d="M458 470 C482 560 480 650 460 730 L404 730 C414 640 404 560 374 506 Z" fill={HAIR} />
            {variant === 'about' && (
              <g className="mc-hand">
                <rect x="491" y="500" width="56" height="240" rx="28" fill={SKIN} />
                <ellipse cx="519" cy="492" rx="40" ry="44" fill={SKIN} />
                <ellipse cx="490" cy="448" rx="11" ry="34" fill={SKIN} transform="rotate(-12 490 448)" />
                <ellipse cx="510" cy="438" rx="11" ry="38" fill={SKIN} transform="rotate(-4 510 438)" />
                <ellipse cx="531" cy="438" rx="11" ry="38" fill={SKIN} transform="rotate(4 531 438)" />
                <ellipse cx="551" cy="448" rx="11" ry="34" fill={SKIN} transform="rotate(12 551 448)" />
                <ellipse cx="475" cy="505" rx="12" ry="28" fill={SKIN} transform="rotate(-40 475 505)" />
                <rect x="481" y="620" width="76" height="130" rx="14" style={shirt} />
              </g>
            )}
            {variant === 'projects' && (
              <g>
                <rect x="140" y="618" width="320" height="140" rx="16" fill="#2a2a30" />
                <rect x="140" y="618" width="320" height="140" rx="16" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="3" />
                <circle cx="300" cy="676" r="16" style={shirt} />
              </g>
            )}
          </g>

          <g ref={set('head')}>
            <g ref={set('earL')}>
              <ellipse cx="138" cy="380" rx="46" ry="60" fill={SKIN} />
              <ellipse cx="138" cy="380" rx="46" ry="60" fill={u('shade')} />
              <circle cx="138" cy="438" r="8" style={{ fill: 'var(--accent)' }} stroke="#000" strokeOpacity="0.3" />
            </g>
            <g ref={set('earR')}>
              <ellipse cx="462" cy="380" rx="46" ry="60" fill={SKIN} />
              <ellipse cx="462" cy="380" rx="46" ry="60" fill={u('shade')} />
              <circle cx="462" cy="438" r="8" style={{ fill: 'var(--accent)' }} stroke="#000" strokeOpacity="0.3" />
            </g>

            <path d="M300 150 C402 150 470 226 470 348 C470 472 396 562 300 562 C204 562 130 472 130 348 C130 226 198 150 300 150 Z" fill={SKIN} />
            <path d="M300 150 C402 150 470 226 470 348 C470 472 396 562 300 562 C204 562 130 472 130 348 C130 226 198 150 300 150 Z" fill={u('shade')} />
            <path d="M300 150 C402 150 470 226 470 348 C470 472 396 562 300 562 C204 562 130 472 130 348 C130 226 198 150 300 150 Z" fill={u('hi')} />

            <g ref={set('blush')}>
              <ellipse cx="190" cy="430" rx={happy ? 50 : 44} ry={happy ? 34 : 30} fill={u('blush')} />
              <ellipse cx="410" cy="430" rx={happy ? 50 : 44} ry={happy ? 34 : 30} fill={u('blush')} />
            </g>

            <g ref={set('face')}>
              <g ref={set('brows')}>
                <path d={happy ? 'M200 296 Q230 276 262 290' : 'M200 304 Q230 288 262 298'} fill="none" stroke={HAIR} strokeWidth="11" strokeLinecap="round" />
                <path d={happy ? 'M338 290 Q370 276 400 296' : 'M338 298 Q370 288 400 304'} fill="none" stroke={HAIR} strokeWidth="11" strokeLinecap="round" />
              </g>

              <g ref={set('eyes')}>
                {happy ? (
                  <>
                    <path d="M214 356 Q240 324 266 356" fill="none" stroke="#111" strokeWidth="13" strokeLinecap="round" />
                    <path d="M334 356 Q360 324 386 356" fill="none" stroke="#111" strokeWidth="13" strokeLinecap="round" />
                    <path d="M212 346 L199 338 M386 346 L399 338" stroke="#111" strokeWidth="5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <ellipse cx="240" cy="350" rx="25" ry="31" fill={u('eye')} />
                    <circle cx="231" cy="336" r="8.5" fill="#fff" />
                    <circle cx="250" cy="361" r="3.5" fill="#fff" opacity="0.8" />
                    <ellipse cx="360" cy="350" rx="25" ry="31" fill={u('eye')} />
                    <circle cx="351" cy="336" r="8.5" fill="#fff" />
                    <circle cx="370" cy="361" r="3.5" fill="#fff" opacity="0.8" />
                    {/* ขนตา */}
                    <path d="M218 334 L203 325 M215 348 L199 345 M215 362 L201 366" stroke="#111" strokeWidth="5" strokeLinecap="round" />
                    <path d="M382 334 L397 325 M385 348 L401 345 M385 362 L399 366" stroke="#111" strokeWidth="5" strokeLinecap="round" />
                  </>
                )}
              </g>

              {variant === 'skills' && (
                <g fill="#fff" fillOpacity="0.1" stroke="#25252b" strokeWidth="7" strokeLinecap="round">
                  <circle cx="240" cy="350" r="46" />
                  <circle cx="360" cy="350" r="46" />
                  <path d="M286 346 Q300 334 314 346" fill="none" />
                  <path d="M194 344 L152 330 M406 344 L448 330" fill="none" />
                </g>
              )}

              <path d="M420 382 L423.5 391 L433 391.5 L425.6 397.5 L428.2 406.8 L420 401.5 L411.8 406.8 L414.4 397.5 L407 391.5 L416.5 391 Z" fill="#2a1a14" />

              <g transform={happy ? 'translate(300 440) scale(1.06 1.12) translate(-300 -440)' : undefined}>
                <path d="M218 440 Q300 458 382 440 Q376 524 300 530 Q224 524 218 440 Z" fill="#3d0f0f" />
                <g clipPath={u('mouth')}>
                  <ellipse cx="300" cy="530" rx="46" ry="22" fill="#d9575a" />
                  <path d="M210 436 Q300 456 390 436 L390 474 Q300 490 210 474 Z" fill="#fff" />
                  <path d="M236 516 Q300 500 364 516 L364 540 L236 540 Z" fill="#f3efe9" />
                  <path d="M262 452 V484 M300 456 V488 M338 452 V484" stroke="#000" strokeOpacity="0.08" strokeWidth="2" />
                </g>
                <path d="M218 440 Q300 458 382 440 Q376 524 300 530 Q224 524 218 440 Z" fill="none" stroke="#b03a3a" strokeOpacity="0.6" strokeWidth="4" />
              </g>

              <g ref={set('nose')}>
                <ellipse cx="300" cy="414" rx="28" ry="12" fill="#6b2a14" opacity="0.14" />
                <ellipse cx="300" cy="398" rx="29" ry="26" fill={SKIN} />
                <ellipse cx="300" cy="398" rx="29" ry="26" fill={u('nose')} />
                <ellipse cx="291" cy="387" rx="10" ry="8" fill="#fff" opacity="0.45" />
              </g>
            </g>

            {/* ผมด้านหน้าพร้อมแสกข้าง */}
            <g ref={set('hair')}>
              <path d="M128 350 C108 190 190 104 300 104 C410 104 492 190 472 350 C462 300 448 262 420 238 C380 270 320 262 276 226 C250 262 196 284 150 292 C140 308 132 328 128 350 Z" fill={HAIR} />
              <path d="M128 350 C108 190 190 104 300 104 C410 104 492 190 472 350 C462 300 448 262 420 238 C380 270 320 262 276 226 C250 262 196 284 150 292 C140 308 132 328 128 350 Z" fill={u('hairlit')} />
              <path d="M200 150 Q300 104 400 150" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="8" strokeLinecap="round" />
              {variant === 'education' && (
                <g>
                  <path d="M205 128 V176 C205 198 395 198 395 176 V128 Z" fill="#24242a" />
                  <path d="M300 60 L486 114 L300 168 L114 114 Z" fill="#2e2e36" stroke="#fff" strokeOpacity="0.15" strokeWidth="3" strokeLinejoin="round" />
                  <circle cx="300" cy="114" r="9" style={shirt} />
                  <path d="M300 114 L452 124 V196" fill="none" strokeWidth="5" strokeLinecap="round" style={{ stroke: 'var(--accent)' }} />
                  <rect x="444" y="196" width="16" height="36" rx="6" style={shirt} />
                </g>
              )}
              {variant === 'contact' && (
                <g>
                  <path d="M138 330 C130 40 470 40 462 330" fill="none" stroke="#26262c" strokeWidth="13" strokeLinecap="round" />
                  <rect x="108" y="312" width="48" height="92" rx="22" style={shirt} stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
                  <rect x="444" y="312" width="48" height="92" rx="22" style={shirt} stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M132 400 C126 478 168 522 214 514" fill="none" stroke="#26262c" strokeWidth="7" strokeLinecap="round" />
                  <ellipse cx="222" cy="514" rx="18" ry="12" fill="#26262c" />
                </g>
              )}
            </g>
          </g>
        </g>
      </svg>
      <span className="mc-bubble" data-on={happy ? 'true' : 'false'} aria-live="polite">
        {greeting}
      </span>
    </button>
  )
}
