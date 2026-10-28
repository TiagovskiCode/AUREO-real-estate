import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, initScrollMotion } from './lib/motion'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import FeaturedProperties from './components/FeaturedProperties'
import ArchitecturalInterlude from './components/ArchitecturalInterlude'
import ServicesSection from './components/ServicesSection'
import EditorialFeature from './components/EditorialFeature'
import BrandStatement from './components/BrandStatement'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

export default function App() {
  const main = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(main)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      initScrollMotion(main.current!)
    })
    // Images have reserved ratios, but fonts/late layout can still move triggers a little.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SmoothScroll />
      <div className="curtain" aria-hidden>
        <span className="curtain__mark">AUREO</span>
      </div>
      <Navbar />
      <main id="main" ref={main}>
        <HeroSection />
        <AboutSection />
        <FeaturedProperties />
        <ArchitecturalInterlude />
        <ServicesSection />
        <EditorialFeature />
        <BrandStatement />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
