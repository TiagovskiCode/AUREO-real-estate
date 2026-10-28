export type Property = {
  id: string
  name: string
  location: string
  category: string
  price: string
  beds: number
  baths: number
  area: number
  image: string
  alt: string
  description: string
  position?: string
  layout: 'a' | 'b' | 'c' | 'd'
}

/** Fictional sample listings — conceptual content only. */
export const properties: Property[] = [
  {
    id: 'azure-bay',
    name: 'Azure Bay Residence',
    location: 'Cala Serena, Coastal Collection',
    category: 'Beachfront Villa',
    price: '€14,800,000',
    beds: 6,
    baths: 7,
    area: 920,
    image: '/images/azure-bay.jpg',
    alt: 'Aerial view of a beachfront villa with an infinity pool above a turquoise lagoon',
    description: 'A beachfront villa surrounded by tropical gardens.',
    position: '50% 55%',
    layout: 'a',
  },
  {
    id: 'alpine-estate',
    name: 'The Alpine Estate',
    location: 'Val Sereno, Alpine Collection',
    category: 'Mountain Retreat',
    price: '€11,250,000',
    beds: 8,
    baths: 9,
    area: 1240,
    image: '/images/alpine.jpg',
    alt: 'Timber and stone mountain estate reflected in a lake beneath snow-capped peaks',
    description: 'A contemporary mountain retreat with panoramic views.',
    position: '50% 45%',
    layout: 'b',
  },
  {
    id: 'villa-solenne',
    name: 'Villa Solenne',
    location: 'Costa Aurea, Mediterranean Collection',
    category: 'Mediterranean Residence',
    price: '€7,400,000',
    beds: 5,
    baths: 5,
    area: 560,
    image: '/images/solenne.jpg',
    alt: 'Sculptural white Mediterranean villa with a pine tree and a quiet garden path',
    description: 'A refined Mediterranean residence with a private courtyard.',
    position: '50% 50%',
    layout: 'c',
  },
  {
    id: 'the-glasshouse',
    name: 'The Glasshouse',
    location: 'Linden Park, Contemporary Collection',
    category: 'Architectural Home',
    price: '€9,100,000',
    beds: 4,
    baths: 4,
    area: 480,
    image: '/images/glasshouse.jpg',
    alt: 'Dark timber and glass contemporary house glowing at dusk beneath a mature tree',
    description: 'A minimalist architectural home immersed in nature.',
    position: '50% 60%',
    layout: 'd',
  },
]

export const principles = [
  { title: 'Exclusive Properties', text: 'A narrow, deliberate selection of residences with real architectural character.' },
  { title: 'Personalised Service', text: 'One dedicated advisor, a single point of contact, from first viewing to keys.' },
  { title: 'Trusted Expertise', text: 'Candid guidance shaped by craft, context and an eye for lasting value.' },
  { title: 'Global Reach', text: 'A considered network spanning coastlines, mountains and historic cities.' },
]

export const services = [
  { icon: 'key', title: 'Property Acquisition', text: 'Personalised assistance in discovering exceptional homes.' },
  { icon: 'compass', title: 'Property Advisory', text: 'Informed guidance throughout the property selection process.' },
  { icon: 'concierge', title: 'Private Client Services', text: 'A discreet, tailored experience for discerning clients.' },
  { icon: 'trend', title: 'Investment Opportunities', text: 'Curated conceptual opportunities in premium real estate.' },
] as const

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Properties', href: '#properties' },
  { label: 'Our Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export const featureSpecs = [
  { label: 'Location', value: 'Serra Dourada' },
  { label: 'Bedrooms', value: '5' },
  { label: 'Bathrooms', value: '6' },
  { label: 'Built area', value: '640 m²' },
  { label: 'Plot', value: '1.2 ha' },
  { label: 'Guide price', value: '€8,950,000' },
]
