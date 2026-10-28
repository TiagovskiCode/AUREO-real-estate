import { ArrowUpRight } from 'lucide-react'
import AnimatedText from './AnimatedText'
import RevealImage from './RevealImage'
import { principles } from '../data/content'

export default function AboutSection() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__text">
          <p className="label" data-fade>
            <span className="label__dash" aria-hidden /> About AUREO
          </p>
          <AnimatedText as="h2" id="about-title" className="display display--lg">
            Your Home, Your Legacy, Designed Forever.
          </AnimatedText>
          <p className="lede" data-fade>
            AUREO brings exceptional properties and discerning individuals together. From contemporary architectural
            residences to extraordinary private retreats, we curate spaces defined by character, craftsmanship and a
            lasting sense of place.
          </p>
          <a href="#services" className="link-arrow" data-fade>
            <span>Our approach</span>
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden />
          </a>
        </div>

        <div className="about__media">
          <RevealImage
            src="/images/about.jpg"
            alt="Contemporary two-storey home with timber slats, stone cladding and warm lighting at dusk"
            width={736}
            height={1104}
            className="about__image"
            position="50% 40%"
            parallax={6}
          />
          <p className="about__caption label" data-fade>
            Fig. 01 — Contemporary residence, dusk
          </p>
        </div>
      </div>

      <div className="container">
        <ul className="principles" data-stagger>
          {principles.map((p, i) => (
            <li key={p.title} className="principle">
              <span className="principle__n label">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
