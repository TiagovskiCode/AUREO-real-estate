/* AUREO properties — renders the collection from data.js and powers the whole discovery path:
   showcase (pinned horizontal story on desktop) → property detail view → gallery lightbox → enquiry.
   Favourites are stored locally in the browser. Everything here is a frontend-only demonstration. */
(function () {
  'use strict'

  var A = window.AUREO
  var P = window.AUREO_DATA.properties
  // The pinned story shows the collection; signature residences (showcase: false) open only from their own section.
  var S = P.filter(function (p) { return p.showcase !== false })
  var $ = A.$
  var $$ = A.$$
  var motion = A.motion
  var EASE = A.EASE

  var icon = function (n) { return '<svg class="icon" aria-hidden="true"><use href="#i-' + n + '"/></svg>' }
  var pad = function (n) { return (n < 10 ? '0' : '') + n }
  var byId = function (id) { return P.filter(function (p) { return p.id === id })[0] }
  var indexOf = function (id) { return P.map(function (p) { return p.id }).indexOf(id) }
  var imgSize = function (ratio) {
    var r = ratio.split('/').map(Number)
    return { w: 1200, h: Math.round((1200 * r[1]) / r[0]) }
  }

  /* ------------------------------------------------------------------
     Favourites (shortlist)
     ------------------------------------------------------------------ */
  var FKEY = 'aureo-shortlist'
  var favs = []
  try { favs = JSON.parse(localStorage.getItem(FKEY) || '[]') } catch (e) { favs = [] }
  favs = favs.filter(function (id) { return !!byId(id) })

  function syncFavs() {
    $$('[data-fav]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(favs.indexOf(b.getAttribute('data-fav')) > -1))
    })
    var line = $('.form__shortlist')
    if (line) {
      line.hidden = favs.length === 0
      line.textContent = favs.length
        ? 'Your shortlist: ' + favs.map(function (id) { return byId(id).name }).join(', ')
        : ''
    }
  }

  function toggleFav(id) {
    var i = favs.indexOf(id)
    if (i > -1) favs.splice(i, 1)
    else favs.push(id)
    try { localStorage.setItem(FKEY, JSON.stringify(favs)) } catch (e) {}
    syncFavs()
    A.toast(i > -1 ? 'Removed from your shortlist' : byId(id).name + ' saved to your shortlist')
    var btn = $('[data-fav="' + id + '"]')
    if (motion && i === -1) $$('[data-fav="' + id + '"]').forEach(function (b) {
      gsap.fromTo(b.firstElementChild, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)' })
    })
    return btn
  }

  /* ------------------------------------------------------------------
     Showcase markup
     ------------------------------------------------------------------ */
  var track = $('.showcase__track')
  var outro = $('.showcase__outro')
  // Image heights in the horizontal story: tall, wide, square, wide — never the same twice in a row.
  var heights = ['72vh', '56vh', '62vh', '50vh']

  S.forEach(function (p, i) {
    var s = imgSize(p.ratio)
    var im = A.img(p.image)
    var el = document.createElement('article')
    el.className = 'panel panel--' + (i % 2 ? 'down' : 'up')
    el.setAttribute('data-id', p.id)
    el.style.setProperty('--ratio', p.ratio)
    el.style.setProperty('--mh', heights[i])
    el.innerHTML =
      '<button type="button" class="panel__media" data-open="' + p.id + '" data-cursor="View" tabindex="-1" aria-hidden="true">' +
        '<span class="media"><span class="media__zoom">' +
          '<img data-src="' + im.src + '" data-srcset="' + im.srcset + '" sizes="(min-width: 1024px) 40vw, 100vw" width="' + s.w + '" height="' + s.h + '" alt="" decoding="async" style="object-position:' + p.position + '">' +
        '</span></span>' +
        '<span class="panel__arrow">' + icon('arrow-up-right') + '</span>' +
      '</button>' +
      '<div class="panel__body">' +
        '<p class="label"><span class="panel__n">' + pad(i + 1) + '</span>' + p.category + '</p>' +
        '<h3 class="panel__name"><button type="button" data-open="' + p.id + '">' + p.name + '</button></h3>' +
        '<p class="panel__loc">' + icon('map-pin') + p.location + ' · ' + p.collection + '</p>' +
        '<p class="panel__tagline">' + p.tagline + '</p>' +
        '<ul class="panel__specs">' +
          '<li>' + icon('bed') + p.beds + ' beds</li>' +
          '<li>' + icon('bath') + p.baths + ' baths</li>' +
          '<li>' + icon('ruler') + p.area.toLocaleString('en') + ' m²</li>' +
        '</ul>' +
        '<p class="panel__price">' + p.price + '</p>' +
        '<div class="panel__actions">' +
          '<button type="button" class="textlink" data-open="' + p.id + '">View residence <svg class="icon" aria-hidden="true"><use href="#i-long-arrow"/></svg></button>' +
          '<button type="button" class="fav" data-fav="' + p.id + '" aria-pressed="false" aria-label="Save ' + p.name + ' to shortlist">' + icon('heart') + '</button>' +
        '</div>' +
      '</div>'
    track.insertBefore(el, outro)
  })
  // The media button is a pointer affordance; keyboard and screen-reader users use the title and CTA.
  $$('.panel__media img').forEach(function (img, i) { img.alt = S[i].gallery[0].alt })

  // Native lazy-loading misses images inside the transformed horizontal track, so the showcase
  // photos load together once the section comes within about a screen of the viewport.
  var loadShowcase = function () {
    $$('.panel__media img[data-src]').forEach(function (img) {
      img.srcset = img.getAttribute('data-srcset')
      img.src = img.getAttribute('data-src')
      img.removeAttribute('data-src')
      img.removeAttribute('data-srcset')
    })
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting })) { loadShowcase(); io.disconnect() }
    }, { rootMargin: '0px 0px 120% 0px' })
    io.observe($('#properties'))
  } else {
    loadShowcase()
  }

  /* ------------------------------------------------------------------
     Hero: featured-residence selector — thumbnails switch the card, the card opens the residence
     ------------------------------------------------------------------ */
  var PICKS = ['azure-bay', 'the-glasshouse', 'alpine-estate'].map(byId).filter(Boolean)
  var thumbsBox = $('.hero__thumbs')
  if (thumbsBox) {
    PICKS.forEach(function (p, i) {
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'hero__thumb'
      b.setAttribute('data-pick', i)
      b.setAttribute('aria-label', 'Show ' + p.name)
      b.innerHTML = '<img src="' + A.img(p.image).small + '" alt="" width="160" height="110" decoding="async" style="object-position:' + p.position + '">'
      thumbsBox.appendChild(b)
    })
    var card = $('.hero__card')
    var cardText = $$('.hero__card-name, .hero__card-meta', card)
    var setPick = function (i, animate) {
      var p = PICKS[i]
      var apply = function () {
        $('.hero__card-name', card).textContent = p.name
        $('.hero__card-meta', card).textContent = p.location + ' · ' + p.price
        $('.hero__card-count', card).textContent = pad(i + 1) + ' / ' + pad(PICKS.length)
        var cta = $('.hero__card-cta', card)
        cta.setAttribute('data-open', p.id)
        cta.setAttribute('aria-label', 'Explore ' + p.name)
        if (motion && animate) gsap.fromTo(cardText, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: EASE.out })
      }
      $$('[data-pick]').forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)) })
      if (motion && animate) gsap.to(cardText, { y: -8, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: apply })
      else apply()
    }
    setPick(0, false)
    thumbsBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick]')
      if (b) setPick(Number(b.getAttribute('data-pick')), true)
    })
  }

  /* ------------------------------------------------------------------
     Property detail view
     ------------------------------------------------------------------ */
  var detail = $('#detail')
  var inner = $('.detail__inner', detail)
  var state = { open: false, id: null, idx: 0, last: null }
  var shell = function () { return [$('main'), $('#top-nav'), $('.footer'), $('#menu'), $('.to-top')] }

  function setInert(on) {
    shell().forEach(function (el) { if (el) el.toggleAttribute('inert', on) })
  }

  function detailHTML(p, i) {
    var next = P[(i + 1) % P.length]
    var thumbs = p.gallery.map(function (g, n) {
      return '<button type="button" class="detail__thumb" data-thumb="' + n + '" aria-label="Show image ' + (n + 1) + ' of ' + p.gallery.length + '" aria-current="' + (n === 0) + '">' +
        '<img src="' + A.img(g.src).small + '" alt="" width="160" height="110" loading="lazy" style="object-position:' + g.position + '"></button>'
    }).join('')
    var highlights = p.highlights.map(function (h, n) {
      return '<li><span class="label">' + pad(n + 1) + '</span><h3>' + h.title + '</h3><p>' + h.text + '</p></li>'
    }).join('')
    var g0 = p.gallery[0]
    var im0 = A.img(g0.src)
    return (
      '<div class="detail__bar">' +
        '<button type="button" class="btn btn--glass-dark btn--sm" data-d="close">' + icon('arrow-left') + '<span>Collection</span></button>' +
        '<div class="detail__pager">' +
          '<button type="button" class="icon-btn" data-d="prev" aria-label="Previous residence">' + icon('arrow-left') + '</button>' +
          '<p class="detail__index label">Residence ' + pad(i + 1) + ' / ' + pad(P.length) + '</p>' +
          '<button type="button" class="icon-btn" data-d="next" aria-label="Next residence">' + icon('arrow-right') + '</button>' +
        '</div>' +
        '<div class="detail__bar-actions">' +
          '<button type="button" class="icon-btn" data-d="share" aria-label="Copy a link to ' + p.name + '">' + icon('link') + '</button>' +
          '<button type="button" class="fav" data-fav="' + p.id + '" aria-pressed="false" aria-label="Save ' + p.name + ' to shortlist">' + icon('heart') + '</button>' +
          '<button type="button" class="icon-btn" data-d="close" aria-label="Close property">' + icon('x') + '</button>' +
        '</div>' +
      '</div>' +
      '<section class="detail__hero" aria-label="Gallery">' +
        '<button type="button" class="detail__stage" data-d="lightbox" aria-label="Open the gallery, image 1 of ' + p.gallery.length + '">' +
          '<img src="' + im0.src + '" srcset="' + im0.srcset + '" sizes="100vw" alt="' + g0.alt + '" width="1800" height="1100" style="object-position:' + g0.position + '">' +
        '</button>' +
        '<div class="detail__thumbs" role="group" aria-label="Gallery thumbnails">' + thumbs + '</div>' +
        '<button type="button" class="btn btn--glass btn--sm detail__expand" data-d="lightbox">' + icon('expand') + '<span>View gallery (' + p.gallery.length + ')</span></button>' +
      '</section>' +
      '<div class="detail__grid">' +
        '<div class="detail__main">' +
          '<p class="label"><span class="label__dash" aria-hidden="true"></span>' + p.category + ' · ' + p.collection + '</p>' +
          '<h1 id="detail-title" class="display display--lg">' + p.name + '</h1>' +
          '<p class="detail__loc">' + icon('map-pin') + p.location + '</p>' +
          '<p class="detail__tagline">' + p.tagline + '</p>' +
          '<div class="detail__story"><p>' + p.narrative.join('</p><p>') + '</p></div>' +
        '</div>' +
        '<aside class="detail__aside" aria-label="Key details">' +
          '<p class="label">Guide price</p>' +
          '<p class="detail__price">' + p.price + '</p>' +
          '<dl class="detail__specs">' +
            '<div><dt>' + icon('bed') + 'Bedrooms</dt><dd>' + p.beds + '</dd></div>' +
            '<div><dt>' + icon('bath') + 'Bathrooms</dt><dd>' + p.baths + '</dd></div>' +
            '<div><dt>' + icon('ruler') + 'Interior</dt><dd>' + p.area.toLocaleString('en') + ' m²</dd></div>' +
            '<div><dt>' + icon('map-pin') + 'Plot</dt><dd>' + p.plot + '</dd></div>' +
            '<div><dt>' + icon('check') + 'Completed</dt><dd>' + p.year + '</dd></div>' +
          '</dl>' +
          '<button type="button" class="btn btn--navy btn--block" data-d="enquire"><span>Request a private viewing</span>' + A.arrow() + '</button>' +
          '<p class="detail__note">Sample listing — fictional content for this concept. No real property or availability is implied.</p>' +
        '</aside>' +
      '</div>' +
      '<section class="detail__highlights" aria-labelledby="hl-title">' +
        '<h2 id="hl-title" class="detail__h2 display">What defines it</h2>' +
        '<ul>' + highlights + '</ul>' +
      '</section>' +
      '<button type="button" class="detail__next" data-d="next" aria-label="Next residence: ' + next.name + '">' +
        '<span class="detail__next-text"><span class="label">Next residence</span><span class="detail__next-name">' + next.name + '</span><span class="detail__next-loc">' + next.location + ' · ' + next.price + '</span></span>' +
        '<span class="detail__next-img"><img src="' + A.img(next.image).small + '" alt="" width="240" height="240" loading="lazy" style="object-position:' + next.position + '"></span>' +
        '<span class="detail__next-arrow">' + icon('arrow-right') + '</span>' +
      '</button>'
    )
  }

  /* Each residence has its own address (#/villa-solenne): shareable, and the browser's Back
     button closes the detail view instead of leaving the site. */
  var ROUTE = /^#\/([\w-]+)$/
  var routeId = function () {
    var m = location.hash.match(ROUTE)
    return m && byId(m[1]) ? m[1] : null
  }
  var pendingAfter = null

  function openDetail(id, trigger, fromHistory) {
    var i = indexOf(id)
    if (i < 0) return
    if (!fromHistory) history.pushState({ aureo: 'detail' }, '', '#/' + id)
    gsap.killTweensOf(detail) // a quick Back→Forward must not let a closing animation finish over the reopened view
    state.last = trigger || document.activeElement
    state.id = id
    state.idx = 0
    state.open = true
    inner.innerHTML = detailHTML(P[i], i)
    syncFavs()
    detail.scrollTop = 0
    A.lock('detail', true)
    setInert(true)
    gsap.set(detail, { visibility: 'visible' })

    if (motion) {
      gsap.fromTo(detail, { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: EASE.inOut,
        onComplete: function () { gsap.set(detail, { clearProps: 'clipPath' }) }
      })
      gsap.from($('.detail__stage img', detail), { scale: 1.16, duration: 1.7, ease: EASE.out, delay: 0.3 })
      gsap.from($$('.detail__bar > *, .detail__thumbs, .detail__expand, .detail__main > *, .detail__aside > *', detail), {
        y: 26, opacity: 0, duration: 0.9, stagger: 0.05, ease: EASE.out, delay: 0.55
      })
    }
    var close = $('[data-d="close"]', detail)
    if (close) close.focus({ preventScroll: true })
  }

  // Closing through the UI walks back through history, so the URL and the view never disagree.
  function closeDetail(after) {
    if (!state.open) return
    if (history.state && history.state.aureo === 'detail') {
      pendingAfter = after || null
      history.back()
      return
    }
    history.replaceState(null, '', location.pathname + location.search)
    doClose(after)
  }

  function doClose(after) {
    if (!state.open) return
    state.open = false
    if (lb.open) closeLightbox()
    var done = function () {
      gsap.set(detail, { visibility: 'hidden', clearProps: 'clipPath' })
      inner.innerHTML = ''
      setInert(false)
      A.lock('detail', false)
      if (state.last && state.last.focus) state.last.focus({ preventScroll: true })
      if (after) after()
    }
    if (motion) {
      gsap.set(detail, { clipPath: 'inset(0% 0% 0% 0%)' })
      gsap.to(detail, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.8, ease: EASE.inOut, onComplete: done })
    } else {
      done()
    }
  }

  function switchDetail(id, fromHistory) {
    if (!fromHistory) history.replaceState({ aureo: 'detail' }, '', '#/' + id)
    var swap = function () {
      var i = indexOf(id)
      state.id = id
      state.idx = 0
      inner.innerHTML = detailHTML(P[i], i)
      detail.scrollTop = 0
      syncFavs()
      if (motion) gsap.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: EASE.out })
      var close = $('[data-d="close"]', detail)
      if (close) close.focus({ preventScroll: true })
    }
    if (motion) gsap.to(inner, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: swap })
    else swap()
  }

  function setGallery(n) {
    var p = byId(state.id)
    var g = p.gallery[n]
    var img = $('.detail__stage img', detail)
    state.idx = n
    var apply = function () {
      var im = A.img(g.src)
      img.srcset = im.srcset
      img.src = im.src
      img.alt = g.alt
      img.style.objectPosition = g.position
      if (motion) gsap.to(img, { opacity: 1, duration: 0.5, ease: EASE.out })
    }
    if (motion) gsap.to(img, { opacity: 0, duration: 0.2, onComplete: apply })
    else apply()
    $$('.detail__thumb', detail).forEach(function (t, k) { t.setAttribute('aria-current', String(k === n)) })
    $('.detail__stage', detail).setAttribute('aria-label', 'Open the gallery, image ' + (n + 1) + ' of ' + p.gallery.length)
  }

  /* ------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------ */
  var lbEl = $('#lightbox')
  var lbImg = $('.lightbox__stage img', lbEl)
  var lb = { open: false, idx: 0, list: [], last: null }

  function showLightbox(n, animate) {
    lb.idx = (n + lb.list.length) % lb.list.length
    var g = lb.list[lb.idx]
    var apply = function () {
      var im = A.img(g.src)
      lbImg.sizes = '100vw'
      lbImg.srcset = im.srcset
      lbImg.src = im.src
      lbImg.alt = g.alt
      $('.lightbox__caption', lbEl).textContent = g.alt
      $('.lightbox__count', lbEl).textContent = lb.idx + 1 + ' / ' + lb.list.length
      if (motion && animate) gsap.fromTo(lbImg, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.6, ease: EASE.out })
    }
    if (motion && animate) gsap.to(lbImg, { opacity: 0, x: -24, duration: 0.2, onComplete: apply })
    else apply()
  }

  function openLightbox(n, trigger) {
    lb.list = byId(state.id).gallery
    lb.last = trigger
    lb.open = true
    A.lock('lightbox', true)
    showLightbox(n, false)
    gsap.to(lbEl, { autoAlpha: 1, duration: motion ? 0.45 : 0, ease: EASE.out })
    if (motion) gsap.from(lbImg, { scale: 0.94, duration: 0.9, ease: EASE.out })
    $('[data-lb="close"]', lbEl).focus({ preventScroll: true })
  }

  function closeLightbox() {
    lb.open = false
    gsap.to(lbEl, {
      autoAlpha: 0, duration: motion ? 0.35 : 0, ease: 'power2.in',
      onComplete: function () { A.lock('lightbox', false); A.lock('detail', state.open) }
    })
    if (lb.last && lb.last.focus) lb.last.focus({ preventScroll: true })
  }

  /* ------------------------------------------------------------------
     Enquiry path
     ------------------------------------------------------------------ */
  var autoMessage = ''
  function prefill(interest, message) {
    var sel = $('#interest')
    var msg = $('#message')
    if (interest) {
      var match = $$('option', sel).filter(function (o) { return o.textContent === interest })[0]
      if (match) sel.value = match.value || match.textContent
    }
    if (message && (!msg.value.trim() || msg.value === autoMessage)) {
      msg.value = message
      autoMessage = message
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target

    var open = t.closest('[data-open]')
    if (open) return openDetail(open.getAttribute('data-open'), open)

    var fav = t.closest('[data-fav]')
    if (fav) return toggleFav(fav.getAttribute('data-fav'))

    var thumb = t.closest('[data-thumb]')
    if (thumb) return setGallery(Number(thumb.getAttribute('data-thumb')))

    var lbBtn = t.closest('[data-lb]')
    if (lbBtn) {
      var a = lbBtn.getAttribute('data-lb')
      if (a === 'close') closeLightbox()
      if (a === 'prev') showLightbox(lb.idx - 1, true)
      if (a === 'next') showLightbox(lb.idx + 1, true)
      return
    }

    var d = t.closest('[data-d]')
    if (d) {
      var act = d.getAttribute('data-d')
      if (act === 'close') closeDetail()
      if (act === 'lightbox') openLightbox(state.idx, d)
      if (act === 'next') switchDetail(P[(indexOf(state.id) + 1) % P.length].id)
      if (act === 'prev') switchDetail(P[(indexOf(state.id) - 1 + P.length) % P.length].id)
      if (act === 'share') {
        var url = location.href
        var copied = function () { A.toast('Link copied — this residence opens directly from it') }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(copied, function () { A.toast(url) })
        } else {
          A.toast(url)
        }
      }
      if (act === 'enquire') {
        var p = byId(state.id)
        closeDetail(function () {
          prefill(p.name, 'I would like to arrange a private viewing of ' + p.name + ' (' + p.location + '). Sample listing.')
          A.scrollTo('#contact')
        })
      }
      return
    }

    var cta = t.closest('[data-interest]')
    if (cta) prefill(cta.getAttribute('data-interest'), cta.getAttribute('data-message'))

    if (t.closest('[data-collection-cta]')) {
      prefill('A private collection brief', 'Please share the wider private collection. Sample enquiry.')
    }
  })

  // Back / Forward and hand-typed addresses drive the detail view.
  window.addEventListener('popstate', function () {
    var id = routeId()
    if (id) {
      if (!state.open) openDetail(id, null, true)
      else if (id !== state.id) switchDetail(id, true)
    } else if (state.open) {
      var after = pendingAfter
      pendingAfter = null
      doClose(after)
    }
  })

  document.addEventListener('keydown', function (e) {
    if (lb.open) {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') showLightbox(lb.idx - 1, true)
      else if (e.key === 'ArrowRight') showLightbox(lb.idx + 1, true)
      else A.trapTab(e, lbEl)
      return
    }
    if (state.open) {
      if (e.key === 'Escape') closeDetail()
      else A.trapTab(e, detail)
    }
  })

  /* ------------------------------------------------------------------
     Pointer-led interactions (fine pointers + full motion only)
     ------------------------------------------------------------------ */
  function initPointer() {
    if (!motion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    var c = $('.cursor')
    var label = $('.cursor__label')
    gsap.set(c, { autoAlpha: 0, scale: 0.5 })
    var cx = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3' })
    var cy = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3' })
    document.addEventListener('pointermove', function (e) { cx(e.clientX); cy(e.clientY) }, { passive: true })
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor]')
      if (!t) return
      label.textContent = t.getAttribute('data-cursor')
      gsap.to(c, { autoAlpha: 1, scale: 1, duration: 0.4, ease: EASE.out, overwrite: 'auto' })
    })
    document.addEventListener('pointerout', function (e) {
      var t = e.target.closest('[data-cursor]')
      if (t && !(e.relatedTarget && t.contains(e.relatedTarget))) {
        gsap.to(c, { autoAlpha: 0, scale: 0.5, duration: 0.3, ease: 'power2.in', overwrite: 'auto' })
      }
    })

    // Title and arrow lean toward the pointer while it moves across a property image.
    $$('.panel').forEach(function (panel) {
      var media = $('.panel__media', panel)
      var arrow = $('.panel__arrow', panel)
      var name = $('.panel__name button', panel)
      var ax = gsap.quickTo(arrow, 'x', { duration: 0.6, ease: 'power3' })
      var ay = gsap.quickTo(arrow, 'y', { duration: 0.6, ease: 'power3' })
      var nx = gsap.quickTo(name, 'x', { duration: 0.7, ease: 'power3' })
      media.addEventListener('pointermove', function (e) {
        var r = media.getBoundingClientRect()
        var px = (e.clientX - r.left) / r.width - 0.5
        var py = (e.clientY - r.top) / r.height - 0.5
        ax(px * 40); ay(py * 40); nx(px * 16)
      })
      media.addEventListener('pointerleave', function () { ax(0); ay(0); nx(0) })
    })
  }

  /* ------------------------------------------------------------------
     Showcase motion — called by main.js once the page is ready
     ------------------------------------------------------------------ */
  // Direct navigation for the pinned story: numbered jump links and previous/next arrows.
  var showcaseNav = null
  var jumpBox = $('.showcase__jump')
  S.forEach(function (p, i) {
    var b = document.createElement('button')
    b.type = 'button'
    b.className = 'showcase__jump-btn'
    b.setAttribute('data-jump', i)
    b.setAttribute('aria-label', 'Go to ' + p.name)
    b.textContent = pad(i + 1) + ' ' + p.name.replace(/^The /, '').replace(/ (Residence|Estate)$/, '')
    jumpBox.appendChild(b)
  })
  document.addEventListener('click', function (e) {
    if (!showcaseNav) return
    var j = e.target.closest('[data-jump]')
    if (j) return showcaseNav.jump(Number(j.getAttribute('data-jump')))
    var s = e.target.closest('[data-showcase]')
    if (s) showcaseNav.step(s.getAttribute('data-showcase') === 'next' ? 1 : -1)
  })

  A.initShowcaseMotion = function () {
    if (!motion) return
    var section = $('#properties')
    var pin = $('.showcase__pin')
    var bar = $('.showcase__bar i')
    var count = $('.showcase__count b')
    var mm = gsap.matchMedia()

    mm.add(
      { desk: '(min-width: 1024px) and (min-height: 540px)', mob: '(max-width: 1023px), (max-height: 539px)' },
      function (ctx) {
        gsap.from($$('.showcase__intro > *'), {
          y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: EASE.out,
          scrollTrigger: { trigger: section, start: 'top 75%', once: true }
        })

        if (ctx.conditions.desk) {
          section.classList.add('is-horizontal')
          var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth) }
          var panels = $$('.panel')
          var tween

          // Which property is closest to the middle of the screen right now?
          var currentIndex = function () {
            var best = 0
            var bestD = Infinity
            panels.forEach(function (p, i) {
              var r = p.getBoundingClientRect()
              var d = Math.abs(r.left + r.width / 2 - window.innerWidth / 2)
              if (d < bestD) { bestD = d; best = i }
            })
            return best
          }
          var scrollToProgress = function (p) {
            var st = tween.scrollTrigger
            var y = st.start + Math.max(0, Math.min(1, p)) * (st.end - st.start)
            if (A.lenis) A.lenis.scrollTo(y, { duration: 1.4, easing: function (t) { return 1 - Math.pow(1 - t, 4) } })
            else window.scrollTo(0, y)
          }
          var goTo = function (i) {
            var pad0 = parseFloat(getComputedStyle(track).paddingLeft)
            var left = panels[i].getBoundingClientRect().left - track.getBoundingClientRect().left
            scrollToProgress((left - pad0) / dist())
          }
          var syncUI = function (progress) {
            gsap.set(bar, { scaleX: progress })
            var idx = currentIndex()
            count.textContent = pad(idx + 1)
            $$('[data-jump]').forEach(function (b, k) { b.setAttribute('aria-current', String(k === idx)) })
          }
          showcaseNav = {
            jump: function (i) { goTo(i) },
            step: function (dir) {
              var i = currentIndex()
              if (dir < 0) i > 0 ? goTo(i - 1) : scrollToProgress(0)
              else i < panels.length - 1 ? goTo(i + 1) : scrollToProgress(1)
            }
          }
          tween = gsap.to(track, {
            x: function () { return -dist() },
            ease: 'none',
            scrollTrigger: {
              trigger: section, pin: pin, start: 'top top',
              end: function () { return '+=' + dist() },
              scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
              refreshPriority: 1, // the pin adds scroll length, so it must be measured before every other trigger
              onUpdate: function (self) { syncUI(self.progress) },
              // The showcase has its own arrows at the bottom right; keep back-to-top out of their way.
              onToggle: function (self) { $('.to-top').classList.toggle('is-covered', self.isActive) }
            }
          })
          $$('.panel__media img').forEach(function (img) {
            gsap.fromTo(img, { xPercent: -7 }, {
              xPercent: 7, ease: 'none',
              scrollTrigger: { trigger: img.closest('.panel__media'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
            })
          })
          $$('.panel').forEach(function (panel) {
            gsap.from($$('.panel__body > *', panel), {
              y: 30, opacity: 0, duration: 0.9, stagger: 0.07, ease: EASE.out,
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 88%', once: true }
            })
          })
          return function () {
            showcaseNav = null
            section.classList.remove('is-horizontal')
            $('.to-top').classList.remove('is-covered')
            count.textContent = '01'
          }
        }

        // Tablet and phone: natural vertical scrolling, nothing pinned.
        $$('.panel').forEach(function (panel) {
          gsap.from($('.panel__media', panel), {
            clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'power4.inOut',
            scrollTrigger: { trigger: panel, start: 'top 85%', once: true }
          })
          gsap.from($$('.panel__body > *', panel), {
            y: 30, opacity: 0, duration: 0.9, stagger: 0.07, ease: EASE.out,
            scrollTrigger: { trigger: $('.panel__body', panel), start: 'top 90%', once: true }
          })
        })
      }
    )
  }

  syncFavs()
  initPointer()

  // Arriving from a shared link: put the page itself one step back in history, then open the residence,
  // so Back lands on AUREO rather than leaving the site.
  var initial = routeId()
  if (initial) {
    history.replaceState(null, '', location.pathname + location.search)
    history.pushState({ aureo: 'detail' }, '', '#/' + initial)
    openDetail(initial, null, true)
  }
})()
