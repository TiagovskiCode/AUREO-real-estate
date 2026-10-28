import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** Shared easing + timing tokens so every reveal on the page feels related. */
export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  cinematic: 'expo.out',
}

export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches

/**
 * Wires the page-wide scroll vocabulary. Elements opt in through data attributes:
 *  [data-split]       line-by-line masked text reveal
 *  [data-fade]        soft rise + fade
 *  [data-stagger]     children rise in sequence
 *  [data-reveal-img]  clip-path reveal with a settling scale on the inner <img>
 *  [data-parallax]    restrained scrubbed drift on an <img>
 */
export function initScrollMotion(root: HTMLElement) {
  const q = <T extends HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root)

  q('[data-split]').forEach((el) => {
    let played = false
    const delay = Number(el.dataset.delay ?? 0)
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        if (played) return
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.15,
          delay,
          ease: EASE.out,
          stagger: 0.09,
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
            onEnter: () => {
              played = true
            },
          },
        })
      },
    })
  })

  q('[data-fade]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 1,
      delay: Number(el.dataset.delay ?? 0),
      ease: EASE.out,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })

  q('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: EASE.out,
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  })

  q('[data-reveal-img]').forEach((el) => {
    const img = el.querySelector('img')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
    tl.fromTo(
      el,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' },
    )
    if (img) tl.from(img, { scale: 1.3, duration: 1.9, ease: EASE.out }, 0)
  })

  q<HTMLImageElement>('[data-parallax]').forEach((img) => {
    const amount = Number(img.dataset.parallax || 8)
    gsap.fromTo(
      img,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })
}

export { gsap, ScrollTrigger, SplitText }
