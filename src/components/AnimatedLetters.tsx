import { useState } from 'react'

type Props = { text: string; className?: string; colorful?: boolean }

// แยกข้อความเป็นทีละตัวอักษร ตัวที่เมาส์ชี้เล่นแอนิเมชัน rubberBand
// colorful = true จะให้แต่ละตัวอักษรได้สีต่างกัน (สีมาจาก --c1 ถึง --c6 ใน index.css)
export default function AnimatedLetters({ text, className = '', colorful = false }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <span className={className}>
      {[...text].map((c, i) =>
        c === ' ' ? (
          ' '
        ) : (
          <span
            key={i}
            className={`letter ${hovered === i ? 'animate__animated animate__rubberBand' : ''}`}
            style={colorful ? { color: `var(--c${(i % 6) + 1})` } : undefined}
            onMouseEnter={() => setHovered(i)}
            onAnimationEnd={() => setHovered(null)}
          >
            {c}
          </span>
        )
      )}
    </span>
  )
}
