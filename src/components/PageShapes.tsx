import type { CSSProperties } from 'react'
import '../page-fx.css'

export type Shape = {
  kind: 'ring' | 'dot' | 'star' | 'squig' | 'plus' | 'tri'
  x: number // ตำแหน่งแนวนอน (% ของหน้า)
  y: number // ตำแหน่งแนวตั้ง (% ของหน้า)
  size: number // px
  color: number // 1-6 = --c1..--c6
  speed?: number // ระยะเลื่อน parallax (px), ติดลบ = ลอยขึ้น
}

// รูปทรงตกแต่งพื้นหลัง ลอยเบาๆ และเลื่อนตามการ scroll (ดู hooks/usePageIntro.ts)
export default function PageShapes({ shapes }: { shapes: Shape[] }) {
  return (
    <div className="deco-shapes" aria-hidden="true">
      {shapes.map((s, i) => (
        <span
          key={i}
          className={`deco-shape s-${s.kind}`}
          data-speed={s.speed ?? -100}
          style={{
            left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            '--sc': `var(--c${s.color})`, '--d': `${i * 0.7}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
