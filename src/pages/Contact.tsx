import { useRef, useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import AnimatedLetters from '../components/AnimatedLetters'
import PageShapes, { type Shape } from '../components/PageShapes'
import usePageIntro from '../hooks/usePageIntro'

const SHAPES: Shape[] = [
  { kind: 'plus', x: 1, y: 14, size: 28, color: 3, speed: -90 },
  { kind: 'dot', x: 46, y: 90, size: 20, color: 5, speed: -130 },
  { kind: 'squig', x: 22, y: 92, size: 90, color: 2, speed: -60 },
]

// พิกัดโดยประมาณของ KMUTNB แก้เป็นที่ที่คุณต้องการให้แสดงได้
const POSITION: [number, number] = [13.8189, 100.514]

export default function Contact() {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState('')
  const root = useRef<HTMLElement>(null)
  usePageIntro(root)
  // สีหมุดบนแผนที่ = สีหลักของธีม
  const pin = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d93a50'

  const send = (e: FormEvent) => {
    e.preventDefault()
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus('EmailJS keys are missing. Check your .env file.')
      return
    }

    emailjs.sendForm(serviceId, templateId, form.current!, { publicKey }).then(
      () => {
        setStatus('Message sent.')
        form.current?.reset()
      },
      () => setStatus('Sending failed. Please try again.')
    )
  }

  return (
    <section className="page contact-page fx-page" ref={root}>
      <PageShapes shapes={SHAPES} />
      <div className="contact">
        <h1 className="title page-title">
          <AnimatedLetters text="Contact me" colorful />
        </h1>
        <p data-intro>
          I’m open to internship opportunities in Network Security. Send a message and I’ll
          reply as soon as I can.
        </p>

        <form ref={form} onSubmit={send}>
          <input data-intro name="name" placeholder="Name" aria-label="Name" required />
          <input data-intro name="email" type="email" placeholder="Email" aria-label="Email" required />
          <input data-intro name="subject" className="full" placeholder="Subject" aria-label="Subject" required />
          <textarea data-intro name="message" className="full" placeholder="Message" aria-label="Message" required />
          <span className="full note" role="status">{status}</span>
          <button className="btn send" type="submit" data-intro>SEND</button>
        </form>
      </div>

      <div className="map-wrap" data-reveal="right">
      <MapContainer center={POSITION} zoom={13} scrollWheelZoom={false} className="map">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={POSITION} radius={10} pathOptions={{ color: pin, fillOpacity: 0.9 }}>
          <Popup>
            Phimlaphat
            <br />
            Bangkok, Thailand
          </Popup>
        </CircleMarker>
      </MapContainer>
      </div>
    </section>
  )
}
