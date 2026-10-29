/* AUREO core — motion mode, the single scroll controller (Lenis on GSAP's ticker),
   scroll locking and shared helpers. Everything else builds on window.AUREO. */
(function () {
  'use strict'

  gsap.registerPlugin(ScrollTrigger, SplitText)
  ScrollTrigger.config({ ignoreMobileResize: true })

  var root = document.documentElement
  var A = (window.AUREO = {
    motion: root.classList.contains('motion-full'),
    EASE: { out: 'power3.out', inOut: 'power3.inOut', cinematic: 'expo.out' },
    lenis: null,
    $: function (sel, ctx) { return (ctx || document).querySelector(sel) },
    $$: function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)) }
  })

  /* ---- The button arrow: two long arrows in their own cell; one leaves, the other arrives on hover ---- */
  A.arrow = function () {
    var a = '<svg class="icon"><use href="#i-long-arrow"/></svg>'
    return '<span class="btn__arrow" aria-hidden="true">' + a + a + '</span>'
  }

  /* ---- Responsive WebP sources from the generated manifest (js/images.js) ---- */
  A.img = function (path) {
    var name = path.split('/').pop().replace(/\.jpe?g$/i, '')
    var widths = (window.AUREO_IMAGES || {})[name]
    if (!widths) return { src: path, srcset: '', small: path }
    var file = function (w) { return 'images/opt/' + name + '-' + w + '.webp' }
    return {
      src: file(widths[Math.min(1, widths.length - 1)]),
      srcset: widths.map(function (w) { return file(w) + ' ' + w + 'w' }).join(', '),
      small: file(widths[0])
    }
  }

  /* ---- One scroll controller. No second rAF loop, no native overrides. ---- */
  if (A.motion && window.Lenis) {
    A.lenis = new Lenis({
      autoRaf: false,
      lerp: 0.12, // responsive: the page catches up with the wheel quickly
      wheelMultiplier: 1,
      smoothWheel: true
    })
    A.lenis.on('scroll', ScrollTrigger.update)
    // Pin spacers and late layout change the page length; Lenis must re-measure after every refresh,
    // otherwise its scroll limit goes stale and the bottom of the page becomes unreachable.
    ScrollTrigger.addEventListener('refresh', function () { A.lenis.resize() })
    window.addEventListener('load', function () { setTimeout(function () { ScrollTrigger.refresh() }, 300) })
    gsap.ticker.add(function (time) { A.lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
  }

  /* ---- Scroll locking with named locks, so overlays can never deadlock the page ---- */
  var locks = {}
  A.lock = function (key, on) {
    if (on) locks[key] = true
    else delete locks[key]
    var any = Object.keys(locks).length > 0
    root.classList.toggle('is-locked', any)
    if (A.lenis) any ? A.lenis.stop() : A.lenis.start()
  }

  A.scrollTo = function (target, immediate) {
    var el = typeof target === 'string' ? A.$(target) : target
    if (!el) return
    if (A.lenis) {
      A.lenis.scrollTo(el, {
        immediate: !!immediate,
        duration: 1.35,
        easing: function (t) { return 1 - Math.pow(1 - t, 4) }
      })
    } else {
      el.scrollIntoView({ block: 'start' })
    }
  }

  /* ---- In-page anchors ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
    var hash = a.getAttribute('href')
    if (hash.length < 2) return
    var target = A.$(hash)
    if (!target) return
    e.preventDefault()
    A.scrollTo(target)
    history.replaceState(null, '', hash)
  })

  /* ---- Keep Tab inside an open dialog ---- */
  A.trapTab = function (e, container) {
    if (e.key !== 'Tab') return
    var items = A.$$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement })
    if (!items.length) return
    var first = items[0]
    var last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  A.toast = function (text) {
    var t = A.$('.toast')
    t.textContent = text
    gsap.killTweensOf(t)
    gsap.fromTo(t, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: A.motion ? 0.5 : 0, ease: A.EASE.out })
    gsap.to(t, { autoAlpha: 0, y: 8, duration: A.motion ? 0.5 : 0, delay: 2.2, ease: 'power2.in' })
  }
})()
