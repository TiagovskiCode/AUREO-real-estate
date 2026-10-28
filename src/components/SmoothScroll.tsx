import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { setLenis, scrollToTarget } from '../lib/scroll'

/**
 * Lenis driven by GSAP's ticker (one rAF loop) and feeding ScrollTrigger.
 * Skipped entirely under prefers-reduced-motion; anchors then fall back to native scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ autoRaf: false, lerp: 0.1, wheelMultiplier: 0.95 })
      setLenis(lenis)
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time) => lenis!.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const hash = a.getAttribute('href')!
      if (hash.length < 2) return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      e.preventDefault()
      scrollToTarget(target)
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
