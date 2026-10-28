/* AUREO — page orchestration: header, menu, hero timeline, scroll vocabulary, form, motion switch. */
(function () {
  'use strict'

  var A = window.AUREO
  var $ = A.$
  var $$ = A.$$
  var EASE = A.EASE
  var motion = A.motion
  var root = document.documentElement

  /* ---------------------------------------------------------------
     Fixed header — always visible; a GSAP state change once we leave the hero
     --------------------------------------------------------------- */
  var header = $('#top-nav')
  var navBg = $('.nav__bg')
  var navState = null
  if (motion) {
    navState = gsap.timeline({ paused: true })
      .to(navBg, { opacity: 1, duration: 0.6, ease: EASE.out }, 0)
      .to(header, { '--navpad': '0.7rem', duration: 0.6, ease: EASE.out }, 0)
  }
  ScrollTrigger.create({
    start: 'top -60',
    end: 'max',
    onToggle: function (self) {
      header.classList.toggle('is-solid', self.isActive)
      if (navState) self.isActive ? navState.play() : navState.reverse()
    }
  })

  // Back to top: appears once the hero is behind you on this long page.
  var toTop = $('.to-top')
  ScrollTrigger.create({
    start: function () { return window.innerHeight * 1.2 },
    end: 'max',
    onToggle: function (self) { toTop.classList.toggle('is-visible', self.isActive) }
  })
  toTop.addEventListener('click', function () { A.scrollTo('#home') })

  var navLinks = $$('.nav__link')
  navLinks.forEach(function (link) {
    var section = $(link.getAttribute('href'))
    if (!section) return
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: function (self) {
        if (!self.isActive) {
          // Leaving a section clears its mark, so the nav never points at somewhere you no longer are.
          if (link.getAttribute('aria-current')) link.removeAttribute('aria-current')
          return
        }
        navLinks.forEach(function (l) { l.removeAttribute('aria-current') })
        link.setAttribute('aria-current', 'true')
      }
    })
  })

  /* ---------------------------------------------------------------
     Full-screen menu
     --------------------------------------------------------------- */
  var menu = $('#menu')
  var toggle = $('.nav__toggle')
  var menuTl = null
  var menuOpen = false
  var menuItems = $$('a, button', menu)

  function resetMenu() {
    gsap.set(menu, { clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' })
    gsap.set($$('.menu__link span', menu), { yPercent: 110 })
    gsap.set($$('.menu__foot > *', menu), { y: 20, opacity: 0 })
  }

  function setMenu(open) {
    menuOpen = open
    toggle.setAttribute('aria-expanded', String(open))
    $('.sr-only', toggle).textContent = open ? 'Close menu' : 'Open menu'
    menu.setAttribute('aria-hidden', String(!open))
    menuItems.forEach(function (el) { el.tabIndex = open ? 0 : -1 })
    if (menuTl) menuTl.kill()
    var d = motion ? 1 : 0
    A.lock('menu', open)

    if (open) {
      gsap.set(menu, { visibility: 'visible' })
      menuTl = gsap.timeline({ defaults: { ease: EASE.inOut } })
        .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 * d })
        .to($$('.menu__link span', menu), { yPercent: 0, duration: 0.9 * d, stagger: 0.07 * d, ease: EASE.out }, motion ? '-=0.4' : 0)
        .to($$('.menu__foot > *', menu), { y: 0, opacity: 1, duration: 0.7 * d, stagger: 0.08 * d, ease: EASE.out }, motion ? '-=0.6' : 0)
      $('a', menu).focus({ preventScroll: true })
    } else {
      menuTl = gsap.timeline({ onComplete: resetMenu })
        .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7 * d, ease: EASE.inOut })
    }
  }

  resetMenu()
  menuItems.forEach(function (el) { el.tabIndex = -1 })
  toggle.addEventListener('click', function () { setMenu(!menuOpen) })
  $('.menu__close', menu).addEventListener('click', function () { setMenu(false); toggle.focus() })
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false) }) })
  window.addEventListener('keydown', function (e) {
    if (!menuOpen) return
    if (e.key === 'Escape') { setMenu(false); toggle.focus() }
    else A.trapTab(e, menu)
  })
  // If the viewport grows past the mobile breakpoint, never leave the page locked.
  window.matchMedia('(min-width: 1000px)').addEventListener('change', function (m) { if (m.matches && menuOpen) setMenu(false) })

  /* ---------------------------------------------------------------
     Hero — one coordinated timeline, then a quiet scroll hand-off
     --------------------------------------------------------------- */
  function heroIntro() {
    var hero = $('#home')
    var curtain = $('.curtain')
    var navItems = $$('[data-intro="nav"]')
    var copy = $$('[data-intro="copy"]')
    var cta = $$('[data-intro="cta"]')
    var foot = $$('[data-intro="foot"]')
    var started = false

    // Hold everything in its starting pose until the fonts are ready (so lines split correctly).
    gsap.set('.hero__image', { clipPath: 'inset(8% 8% 8% 8%)' })
    gsap.set('.hero__parallax img', { scale: 1.06 })
    gsap.set('.hero__title, .hero__mark', { autoAlpha: 0 })
    gsap.set(navItems, { y: -16, opacity: 0 })
    gsap.set(copy.concat(cta), { y: 22, opacity: 0 })
    gsap.set(foot, { opacity: 0 })

    function run() {
      if (started) return
      started = true
      var split = SplitText.create('.hero__title', { type: 'lines', mask: 'lines', linesClass: 'split-line' })
      gsap.set(split.lines, { yPercent: 115 })
      gsap.set('.hero__title', { autoAlpha: 1 })
      // The oversized wordmark rises letter by letter out of the sky, behind the headline.
      var mark = SplitText.create('.hero__mark', { type: 'chars', mask: 'chars' })
      gsap.set(mark.chars, { yPercent: 105 })
      gsap.set('.hero__mark', { autoAlpha: 1 })

      var tl = gsap.timeline({ defaults: { ease: EASE.cinematic } })
      tl.fromTo('.curtain__mark', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out })
        .to('.curtain__mark', { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, '+=0.12')
        .to(curtain, { yPercent: -100, duration: 0.9, ease: EASE.inOut }, '-=0.1')
        .to('.hero__image', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power4.out' }, '-=0.55')
        .to('.hero__parallax img', { scale: 1, duration: 2.2, ease: EASE.out }, '<')
        .to(mark.chars, { yPercent: 0, duration: 1.5, stagger: 0.07, ease: EASE.out }, '-=1.5')
        .to(navItems, { y: 0, opacity: 1, duration: 1, stagger: 0.07, ease: EASE.out }, '-=1.2')
        .to(split.lines, { yPercent: 0, duration: 1.25, stagger: 0.14, ease: EASE.out }, '-=1.35')
        .to(copy, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: EASE.out }, '-=0.85')
        .to(cta, { y: 0, opacity: 1, duration: 0.9, ease: EASE.out }, '-=0.6')
        .to(foot, { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.4')
        .add(function () { if (curtain) curtain.remove() })
    }

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run)
    setTimeout(run, 1500)
    setTimeout(function () { if (curtain && curtain.parentNode) curtain.remove() }, 7000) // failsafe

    // Scroll hand-off: the photograph settles slower than the page while the copy eases away.
    var st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    gsap.to('.hero__parallax', { yPercent: 8, scale: 1.05, ease: 'none', scrollTrigger: st })
    gsap.to('.hero__veil', { opacity: 0.75, ease: 'none', scrollTrigger: st })
    gsap.to('.hero__mark', { yPercent: -45, ease: 'none', scrollTrigger: st })
    gsap.to('.hero__content', {
      y: -60, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: '55% top', scrub: true }
    })
  }

  /* ---------------------------------------------------------------
     Scroll vocabulary, opt-in through data attributes:
       [data-split] [data-fade] [data-stagger] [data-reveal-img] [data-parallax]
     --------------------------------------------------------------- */
  function scrollMotion() {
    $$('[data-split]').forEach(function (el) {
      var played = false
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: function (self) {
          if (played) return
          return gsap.from(self.lines, {
            yPercent: 115, duration: 1.15, ease: EASE.out, stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true, onEnter: function () { played = true } }
          })
        }
      })
    })

    $$('[data-fade]').forEach(function (el) {
      gsap.from(el, { y: 34, opacity: 0, duration: 1, ease: EASE.out, scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
    })

    $$('[data-stagger]').forEach(function (el) {
      gsap.from(el.children, {
        y: 40, opacity: 0, duration: 1, ease: EASE.out, stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      })
    })

    $$('[data-reveal-img]').forEach(function (el) {
      var img = el.querySelector('img')
      var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' })
      if (img) tl.from(img, { scale: 1.25, duration: 1.9, ease: EASE.out }, 0)
    })

    $$('[data-parallax]').forEach(function (img) {
      var amount = Number(img.getAttribute('data-parallax') || 8)
      gsap.fromTo(img, { yPercent: -amount }, {
        yPercent: amount, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      })
    })
  }

  /* ---------------------------------------------------------------
     Scene changes: dusk falls over the collection, photographs open like windows
     --------------------------------------------------------------- */
  function sceneMotion() {
    // The property story lives in a night environment; the page darkens into it as you arrive.
    gsap.fromTo('#properties',
      { '--sc-bg': 'rgb(247, 246, 242)', '--sc-fg': 'rgb(20, 40, 61)', '--sc-muted': 'rgba(37, 43, 48, 0.72)' },
      {
        '--sc-bg': 'rgb(20, 40, 61)', '--sc-fg': 'rgb(247, 246, 242)', '--sc-muted': 'rgba(247, 246, 242, 0.7)',
        ease: 'none',
        scrollTrigger: { trigger: '#properties', start: 'top 85%', end: 'top 20%', scrub: true }
      })

    $$('.interlude__frame, .closing__frame').forEach(function (frame) {
      gsap.fromTo(frame,
        { clipPath: 'inset(9% 7% 9% 7% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: frame.parentElement, start: 'top 95%', end: 'top 10%', scrub: true }
        })
    })
  }

  /* Buttons: a light that follows the pointer, and a slight magnetic pull on the large CTAs. */
  function buttonPointer() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.btn')
      if (!b) return
      var r = b.getBoundingClientRect()
      b.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
      b.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
    }, { passive: true })
    $$('.btn--lg').forEach(function (b) {
      var x = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3' })
      var y = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3' })
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect()
        x(((e.clientX - r.left) / r.width - 0.5) * 10)
        y(((e.clientY - r.top) / r.height - 0.5) * 8)
      })
      b.addEventListener('pointerleave', function () { x(0); y(0) })
    })
  }

  if (motion) {
    heroIntro()
    A.initShowcaseMotion() // pinned triggers are created first, in page order
    sceneMotion()
    scrollMotion()
    buttonPointer()
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh() })

  /* ---------------------------------------------------------------
     Contact form (demonstration only — nothing is sent anywhere)
     --------------------------------------------------------------- */
  var form = $('.form')
  var success = $('.contact__success')
  var rules = {
    name: function (v) { return v.trim() ? '' : 'Please tell us your name.' },
    email: function (v) { return /^\S+@\S+\.\S+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    message: function (v) { return v.trim().length >= 10 ? '' : 'A few more words would help (10+ characters).' }
  }

  function setError(name, text) {
    var input = form.elements[name]
    var field = input.closest('.field')
    var err = $('.field__error', field)
    field.classList.toggle('has-error', !!text)
    input.setAttribute('aria-invalid', text ? 'true' : 'false')
    if (text) {
      if (!err) {
        err = document.createElement('p')
        err.className = 'field__error'
        err.id = name + '-err'
        field.appendChild(err)
      }
      err.textContent = text
      input.setAttribute('aria-describedby', err.id)
    } else {
      if (err) err.remove()
      input.removeAttribute('aria-describedby')
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    var firstBad = null
    Object.keys(rules).forEach(function (name) {
      var msg = rules[name](form.elements[name].value)
      setError(name, msg)
      if (msg && !firstBad) firstBad = form.elements[name]
    })
    if (firstBad) return firstBad.focus()
    form.hidden = true
    success.hidden = false
    if (motion) gsap.from(success, { y: 24, opacity: 0, duration: 0.8, ease: EASE.out })
    success.focus()
  })

  $('.contact__again', success).addEventListener('click', function () {
    form.reset()
    success.hidden = true
    form.hidden = false
    form.elements.name.focus()
  })

  /* ---------------------------------------------------------------
     Footer: year + motion switch (lets the visitor override a system "reduce motion" setting)
     --------------------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear()
  var mt = $('#motion-toggle')
  var osReduced = root.hasAttribute('data-os-reduced')
  mt.setAttribute('aria-pressed', String(motion))
  $('.motion-toggle__label', mt).textContent = motion
    ? 'Cinematic motion: on'
    : osReduced ? 'Your system prefers reduced motion — turn cinematic motion on' : 'Cinematic motion: off'
  mt.addEventListener('click', function () {
    try { localStorage.setItem('aureo-motion', motion ? 'reduced' : 'full') } catch (e) {}
    location.reload()
  })

  // First visit with a system "reduce motion" setting: say so, and let the visitor choose.
  var prompt = $('.motion-prompt')
  var saved = null
  try { saved = localStorage.getItem('aureo-motion') } catch (e) {}
  if (prompt && osReduced && saved === null) {
    setTimeout(function () { prompt.hidden = false }, 1200)
    prompt.addEventListener('click', function (e) {
      var b = e.target.closest('[data-motion]')
      if (!b) return
      var choice = b.getAttribute('data-motion')
      try { localStorage.setItem('aureo-motion', choice) } catch (err) {}
      if (choice === 'full') location.reload()
      else prompt.hidden = true
    })
  }
})()
