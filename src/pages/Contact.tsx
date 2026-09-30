import { useRef, useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import AnimatedLetters from '../components/AnimatedLetters'

// พิกัดโดยประมาณของ KMUTNB แก้เป็นที่ที่คุณต้องการให้แสดงได้
const POSITION: [number, number] = [13.8189, 100.514]

export default function Contact() {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState('')

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
    <section className="page contact-page">
      <div className="contact">
        <span className="tag">&lt;h1&gt;</span>
        <h1 className="title">
          <AnimatedLetters text="Contact me" />
        </h1>
        <span className="tag">&lt;/h1&gt;</span>
        <p>
          I’m open to internship opportunities in cybersecurity. Send a message and I’ll
          reply as soon as I can.
        </p>

        <form ref={form} onSubmit={send}>
          <input name="name" placeholder="Name" aria-label="Name" required />
          <input name="email" type="email" placeholder="Email" aria-label="Email" required />
          <input name="subject" className="full" placeholder="Subject" aria-label="Subject" required />
          <textarea name="message" className="full" placeholder="Message" aria-label="Message" required />
          <span className="full note" role="status">{status}</span>
          <button className="btn send" type="submit">SEND</button>
        </form>
      </div>

      <MapContainer center={POSITION} zoom={13} scrollWheelZoom={false} className="map">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={POSITION} radius={10} pathOptions={{ color: '#ffd700', fillOpacity: 0.9 }}>
          <Popup>
            Phimlaphat
            <br />
            Bangkok, Thailand
          </Popup>
        </CircleMarker>
      </MapContainer>
    </section>
  )
}