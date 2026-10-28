import { useLayoutEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react'
import { gsap, SplitText, EASE } from '../lib/motion'

export default function HeroSection() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const curtain = document.querySelector('.curtain')
      const split = SplitText.create('.hero__title', { type: 'lines', mask: 'lines', linesClass: 'split-line' })

      gsap.set('.hero__image', { clipPath: 'inset(7% 7% 7% 7%)', scale: 1.12 })
      gsap.set(split.lines, { yPercent: 115 })
      const navItems = Array.from(document.querySelectorAll('[data-intro="nav"]'))
      gsap.set(navItems, { y: -18, opacity: 0 })
      gsap.set('[data-intro="copy"]', { y: 24, opacity: 0 })
      gsap.set('[data-intro="foot"]', { opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: EASE.cinematic } })
      if (curtain) {
        tl.fromTo('.curtain__mark', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE.out })
          .to('.curtain__mark', { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.25')
          .to(curtain, { yPercent: -100, duration: 1.1, ease: EASE.inOut }, '-=0.15')
      }
      tl.to('.hero__image', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 2, ease: 'power4.out' }, curtain ? '-=0.7' : 0)
        .to(navItems, { y: 0, opacity: 1, duration: 1, stagger: 0.07, ease: EASE.out }, '-=1.3')
        .to(split.lines, { yPercent: 0, duration: 1.35, stagger: 0.14, ease: EASE.out }, '-=1.4')
        .to('[data-intro="copy"]', { y: 0, opacity: 1, duration: 1, stagger: 0.14, ease: EASE.out }, '-=0.85')
        .to('[data-intro="foot"]', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.6')
        .add(() => {
          curtain?.remove()
        })

      // Parallax: the photograph drifts slower than the page and gently settles back.
      gsap.to('.hero__image img', {
        yPercent: 14,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__content', {
        yPercent: -12,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '20% top', end: 'bottom top', scrub: true },
      })

      return () => {
        split.revert()
        curtain?.remove()
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__image" aria-hidden={false}>
        <img
          src="/images/hero.jpg"
          width={1920}
          height={1080}
          alt="Mediterranean-style waterfront villa with arched loggias and palms on a calm blue waterway"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero__shade" aria-hidden />

      <div className="container hero__content">
        <p className="label label--light" data-intro="copy">
          Luxury residences · Concept collection
        </p>
        <h1 id="hero-title" className="hero__title">
          Find a Place Worth Calling Home.
        </h1>
        <div className="hero__row">
          <p className="hero__lede" data-intro="copy">
            Exceptional properties. Extraordinary living.
          </p>
          <div className="hero__actions" data-intro="copy">
            <a href="#properties" className="btn btn--sand">
              <span>Explore Properties</span>
              <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden />
            </a>
            <a href="#about" className="link-underline link-underline--light">
              Discover AUREO
            </a>
          </div>
        </div>
      </div>

      <div className="container hero__foot" data-intro="foot">
        <p className="hero__location label label--light">
          <MapPin size={14} strokeWidth={1.5} aria-hidden />
          Waterfront Estate — Coastal Collection
        </p>
        <a href="#about" className="hero__scroll label label--light" aria-label="Scroll to the introduction">
          Scroll
          <span className="hero__scroll-line" aria-hidden>
            <ArrowDown size={14} strokeWidth={1.5} />
          </span>
        </a>
      </div>
    </section>
  )
}
