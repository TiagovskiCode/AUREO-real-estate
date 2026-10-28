import { ArrowUpRight } from 'lucide-react'
import AnimatedText from './AnimatedText'
import PropertyCard from './PropertyCard'
import { properties } from '../data/content'

export default function FeaturedProperties() {
  return (
    <section id="properties" className="section properties" aria-labelledby="properties-title">
      <div className="container">
        <header className="properties__head">
          <p className="label" data-fade>
            <span className="label__dash" aria-hidden /> Featured Properties
          </p>
          <AnimatedText as="h2" id="properties-title" className="display display--lg">
            Exceptional Homes. Extraordinary Living.
          </AnimatedText>
          <p className="properties__note" data-fade>
            A curated selection of fictional residences, presented as sample content for this concept.
          </p>
        </header>

        <div className="properties__grid">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>

        <div className="properties__cta" data-fade>
          <a href="#contact" className="btn btn--navy">
            <span>Explore All Properties</span>
            <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
