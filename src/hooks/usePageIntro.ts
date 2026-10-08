import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Q = (selector: string) => Element[]

/* เล่นจาก from ไปสู่สภาพปกติเสมอ แล้วล้างค่าที่ใส่ไว้ทิ้ง
   (ใช้แทน gsap.from เพราะ from จะจำค่าปัจจุบันเป็นปลายทาง ถ้า CSS transition กำลังทำงาน
   หรือ React StrictMode รันซ้ำ ค่าปลายทางอาจค้างเป็น 0 แล้วของหายไป) */
export function enter(targets: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars = {}) {
  return gsap.fromTo(targets, from, {
    x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, clearProps: 'transform,opacity',
    ...to,
  })
}

/* แอนิเมชันตอนเข้าหน้า ใช้ร่วมกันทุกหน้า
   - .page-title .letter  ตัวอักษรหัวข้อตกลงมาทีละตัว
   - [data-intro]         โผล่ขึ้นมาตามลำดับตอนเปิดหน้า
   - [data-reveal]        โผล่ตอนเลื่อนมาถึง ("up" ค่าเริ่มต้น, "left", "right", "pop")
   - .deco-shape          รูปทรงพื้นหลังเลื่อนด้วยความเร็วต่างกัน (data-speed)
   extra = แอนิเมชันเฉพาะของหน้านั้น
   ผู้ใช้ที่ตั้งค่าลดการเคลื่อนไหวในระบบจะไม่เห็นแอนิเมชันเหล่านี้ */
export default function usePageIntro(root: RefObject<HTMLElement | null>, extra?: (q: Q) => void) {
  useLayoutEffect(() => {
    if (!root.current) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root) as Q

      enter(q('.page-title .letter'),
        { y: -70, rotation: () => gsap.utils.random(-40, 40), opacity: 0 },
        { duration: 0.8, ease: 'back.out(2)', stagger: 0.045 })

      const intro = q('[data-intro]')
      if (intro.length) {
        enter(intro, { y: 28, opacity: 0 }, { duration: 0.7, ease: 'power3.out', stagger: 0.09, delay: 0.35 })
      }

      q('[data-reveal]').forEach((el) => {
        const kind = (el as HTMLElement).dataset.reveal
        const from: gsap.TweenVars =
          kind === 'left' ? { x: -90, rotation: -3 }
          : kind === 'right' ? { x: 90, rotation: 3 }
          : kind === 'pop' ? { scale: 0.7, rotation: -8 }
          : { y: 60 }
        enter(el, { ...from, opacity: 0 }, {
          duration: 0.9, ease: kind === 'pop' ? 'back.out(1.8)' : 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      q('.deco-shape').forEach((el) => {
        gsap.to(el, {
          y: Number((el as HTMLElement).dataset.speed ?? -100), ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      extra?.(q)
    })
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
