import { FormEvent, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import AnimatedText from './AnimatedText'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

const interests = ['Beachfront villa', 'Mountain retreat', 'Mediterranean residence', 'Architectural home', 'Not sure yet']

export default function ContactSection() {
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const next: Errors = {}
    if (!String(f.get('name') ?? '').trim()) next.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(String(f.get('email') ?? '').trim())) next.email = 'Please enter a valid email address.'
    if (String(f.get('message') ?? '').trim().length < 10) next.message = 'A few more words would help (10+ characters).'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setSent(true)
    } else {
      const first = Object.keys(next)[0]
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="label" data-fade>
            <span className="label__dash" aria-hidden /> Contact &amp; Enquiry
          </p>
          <AnimatedText as="h2" id="contact-title" className="display display--lg">
            Let’s Find Your Place in the World.
          </AnimatedText>
          <p className="lede" data-fade>
            Tell us a little about the home you imagine. In a real agency, one of our advisors would reply personally.
            Here, this is a design concept — nothing you enter is stored or sent.
          </p>
          <address className="contact__details" data-fade>
            <p className="label">Conceptual contact details</p>
            <p>Avenida da Luz 100, Lisbon</p>
            <p>hello@aureo.example</p>
            <p>+00 000 000 000</p>
          </address>
        </div>

        <div className="contact__form-wrap" data-fade>
          {sent ? (
            <div className="contact__success" role="status">
              <span className="contact__tick" aria-hidden>
                <Check size={22} strokeWidth={1.25} />
              </span>
              <h3>Thank you.</h3>
              <p>This is a demonstration — your message was not sent anywhere. In a live project, an advisor would be in touch within one working day.</p>
              <button className="link-arrow" onClick={() => setSent(false)}>
                <span>Send another</span>
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className={`field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
                {errors.name && <p id="name-err" className="field__error">{errors.name}</p>}
              </div>
              <div className={`field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
                {errors.email && <p id="email-err" className="field__error">{errors.email}</p>}
              </div>
              <div className="field">
                <label htmlFor="interest">Property interest</label>
                <select id="interest" name="interest" defaultValue={interests[0]}>
                  {interests.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div className={`field ${errors.message ? 'has-error' : ''}`}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} />
                {errors.message && <p id="message-err" className="field__error">{errors.message}</p>}
              </div>
              <button type="submit" className="btn btn--navy">
                <span>Send Enquiry</span>
                <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden />
              </button>
              <p className="form__note">Demonstration form — enquiries are not sent to any real agency.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
