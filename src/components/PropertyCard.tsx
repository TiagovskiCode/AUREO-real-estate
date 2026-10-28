import { ArrowUpRight, Bath, BedDouble, Ruler } from 'lucide-react'
import RevealImage from './RevealImage'
import type { Property } from '../data/content'

type Props = { property: Property; index: number }

export default function PropertyCard({ property: p, index }: Props) {
  return (
    <article className={`property property--${p.layout}`} data-fade>
      <a href="#contact" className="property__link" aria-label={`Enquire about ${p.name}, ${p.price}`}>
        <RevealImage
          src={p.image}
          alt={p.alt}
          width={p.layout === 'd' ? 1800 : 1024}
          height={p.layout === 'd' ? 1200 : 1280}
          className="property__media"
          position={p.position}
          parallax={4}
          sizes="(min-width: 900px) 50vw, 100vw"
        />
        <div className="property__body">
          <div className="property__head">
            <p className="label">
              <span className="property__index">0{index + 1}</span> {p.category}
            </p>
            <span className="property__arrow" aria-hidden>
              <ArrowUpRight size={20} strokeWidth={1.25} />
            </span>
          </div>
          <h3 className="property__name">{p.name}</h3>
          <p className="property__loc">{p.location}</p>
          <p className="property__desc">{p.description}</p>
          <dl className="property__meta">
            <div>
              <dt className="sr-only">Bedrooms</dt>
              <dd>
                <BedDouble size={16} strokeWidth={1.25} aria-hidden /> {p.beds} beds
              </dd>
            </div>
            <div>
              <dt className="sr-only">Bathrooms</dt>
              <dd>
                <Bath size={16} strokeWidth={1.25} aria-hidden /> {p.baths} baths
              </dd>
            </div>
            <div>
              <dt className="sr-only">Area</dt>
              <dd>
                <Ruler size={16} strokeWidth={1.25} aria-hidden /> {p.area.toLocaleString('en')} m²
              </dd>
            </div>
          </dl>
          <p className="property__price">{p.price}</p>
        </div>
      </a>
    </article>
  )
}
