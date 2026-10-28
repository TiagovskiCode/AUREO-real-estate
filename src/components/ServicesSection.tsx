import { Compass, ConciergeBell, KeyRound, TrendingUp } from 'lucide-react'
import AnimatedText from './AnimatedText'
import { services } from '../data/content'

const icons = { key: KeyRound, compass: Compass, concierge: ConciergeBell, trend: TrendingUp }

export default function ServicesSection() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <header className="services__head">
          <p className="label" data-fade>
            <span className="label__dash" aria-hidden /> Our Services
          </p>
          <AnimatedText as="h2" id="services-title" className="display display--lg">
            A More Considered Way to Find Home.
          </AnimatedText>
        </header>

        <ul className="services__grid" data-stagger>
          {services.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <li key={s.title} className="service">
                <div className="service__top">
                  <Icon size={30} strokeWidth={1} aria-hidden />
                  <span className="label">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
