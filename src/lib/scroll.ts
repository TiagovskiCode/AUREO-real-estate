import type Lenis from 'lenis'

/** Single Lenis instance, created by <SmoothScroll />. Null when smoothing is off. */
let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}
export const getLenis = () => instance

export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.6, immediate, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  if (typeof target === 'number') return window.scrollTo({ top: target })
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  el?.scrollIntoView({ block: 'start' })
}
