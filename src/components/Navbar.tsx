import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from '../lib/motion'
import { getLenis } from '../lib/scroll'
import { navLinks } from '../data/content'

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  // Scroll-aware surface: transparent on the hero, solid once past it, tucked away when scrolling down.
  useLayoutEffect(() => {
    const header = headerRef.current!
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80',
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll()
          header.classList.toggle('is-solid', y > 80)
          const hide = self.direction === 1 && y > window.innerHeight * 0.9
          header.classList.toggle('is-hidden', hide)
        },
      })
      navLinks.forEach(({ href }) => {
        const el = document.querySelector(href)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(href),
        })
      })
    })
    return () => ctx.revert()
  }, [])

  // Full-screen menu: a clip-path curtain, then links rise in. Open and close are explicit
  // timelines (rather than a reversed one) so the resting states are always deterministic.
  const resetMenu = () => {
    const menu = menuRef.current!
    gsap.set(menu, { clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' })
    gsap.set(menu.querySelectorAll('.menu__link span'), { yPercent: 110 })
    gsap.set(menu.querySelectorAll('.menu__foot > *'), { y: 20, opacity: 0 })
  }

  useLayoutEffect(() => {
    resetMenu()
    return () => {
      tlRef.current?.kill()
      gsap.killTweensOf(menuRef.current)
    }
  }, [])

  const mounted = useRef(false)
  useEffect(() => {
    const menu = menuRef.current!
    const fast = prefersReducedMotion()
    tlRef.current?.kill()
    if (open) {
      getLenis()?.stop()
      document.body.style.overflow = 'hidden'
      gsap.set(menu, { visibility: 'visible' })
      tlRef.current = gsap
        .timeline({ defaults: { ease: EASE.inOut } })
        .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: fast ? 0 : 0.9 })
        .to(menu.querySelectorAll('.menu__link span'), { yPercent: 0, duration: fast ? 0 : 0.9, stagger: fast ? 0 : 0.07, ease: EASE.out }, fast ? 0 : '-=0.4')
        .to(menu.querySelectorAll('.menu__foot > *'), { y: 0, opacity: 1, duration: fast ? 0 : 0.7, stagger: fast ? 0 : 0.08, ease: EASE.out }, fast ? 0 : '-=0.6')
      menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
    } else if (mounted.current) {
      getLenis()?.start()
      document.body.style.overflow = ''
      tlRef.current = gsap
        .timeline({ onComplete: resetMenu })
        .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: fast ? 0 : 0.7, ease: EASE.inOut })
    }
    mounted.current = true
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header ref={headerRef} className="nav">
        <div className="nav__inner">
          <a href="#home" className="wordmark" aria-label="AUREO — back to top" data-intro="nav">
            AUREO
          </a>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-intro="nav"
                aria-current={active === l.href ? 'true' : undefined}
                className="nav__link"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__end" data-intro="nav">
            <a href="#contact" className="btn btn--outline btn--sm nav__cta">
              <span>Enquire</span>
              <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
            </a>
            <button
              ref={toggleRef}
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span className="nav__bars" aria-hidden>
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="menu" className="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <button className="menu__close" onClick={close} tabIndex={open ? 0 : -1}>
          <X size={22} strokeWidth={1.25} aria-hidden />
          <span className="sr-only">Close menu</span>
        </button>
        <ul className="menu__list">
          {navLinks.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} className="menu__link" onClick={close} tabIndex={open ? 0 : -1}>
                <span>
                  <em>0{i + 1}</em>
                  {l.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <p className="label label--light">Conceptual brand — no real enquiries are handled</p>
          <a href="#contact" onClick={close} className="btn btn--sand" tabIndex={open ? 0 : -1}>
            <span>Enquire</span>
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>
    </>
  )
}
