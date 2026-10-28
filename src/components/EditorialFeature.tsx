import { ArrowUpRight } from 'lucide-react'
import AnimatedText from './AnimatedText'
import RevealImage from './RevealImage'
import { featureSpecs } from '../data/content'

export default function EditorialFeature() {
  return (
    <section className="section feature" aria-labelledby="feature-title">
      <div className="container feature__grid">
        <div className="feature__main">
          <RevealImage
            src="/images/feature.jpg"
            alt="Timber-clad contemporary residence with a floor-to-ceiling glazed entrance and cantilevered upper floor"
            width={2000}
            height={1333}
            className="feature__hero"
            position="40% 50%"
            parallax={6}
            sizes="(min-width: 900px) 60vw, 100vw"
          />
          <RevealImage
            src="/images/interior.jpg"
            alt="Open-plan living room with warm timber panelling, a pale sofa and a glazed garden wall"
            width={1600}
            height={1088}
            className="feature__inset"
            position="30% 50%"
            parallax={5}
            sizes="(min-width: 900px) 30vw, 70vw"
          />
        </div>

        <div className="feature__text">
          <p className="label" data-fade>
            <span className="label__dash" aria-hidden /> Signature Residence · Concept
          </p>
          <AnimatedText as="h2" id="feature-title" className="display display--lg">
            Some Places Stay With You.
          </AnimatedText>
          <p className="lede" data-fade>
            The Linden House rests quietly in the hills, a composition of timber, stone and glass shaped around a single
            ancient tree. Rooms open to the garden, light moves slowly through the day, and every threshold feels
            deliberate.
          </p>
          <dl className="specs" data-stagger>
            {featureSpecs.map((s) => (
              <div key={s.label} className="spec">
                <dt className="label">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <a href="#contact" className="btn btn--navy" data-fade>
            <span>Discover the Residence</span>
            <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
