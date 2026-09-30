import { useState } from 'react'

type Props = { text: string; className?: string }

// แยกข้อความเป็นทีละตัวอักษร แล้วให้ตัวที่เมาส์ชี้เล่นแอนิเมชัน rubberBand
export default function AnimatedLetters({ text, className = '' }: Props) {
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