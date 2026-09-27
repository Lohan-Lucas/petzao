/* Petzão Pet Shop — interações da landing page */
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Cabeçalho com sombra ao rolar ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('menu');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Animação de entrada ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Carrossel de avaliações ---------- */
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  function initCarousel(root) {
    var track = root.querySelector('[data-track]');
    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = root.querySelector('[data-prev]');
    var nextBtn = root.querySelector('[data-next]');
    var playBtn = root.querySelector('[data-toggle]');
    var dotsWrap = root.querySelector('[data-dots]');
    var INTERVAL = 6000;
    var MAX_DOTS = 8;

    var perView = 1;
    var pages = 1;
    var current = 0;
    var timer = null;
    var playing = !reduceMotion;   // o usuário pode pausar/retomar pelo botão
    var hovering = false;
    var focused = false;
    var inView = false;

    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-label', 'Avaliação ' + (i + 1) + ' de ' + slides.length);
    });

    function measure() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var w = slides[0].getBoundingClientRect().width;
      perView = Math.max(1, Math.floor((track.clientWidth + gap) / (w + gap) + 0.05));
      pages = Math.ceil(slides.length / perView);
      buildDots();
      current = Math.min(current, pages - 1);
      updateUI();
    }

    function pageOffset(page) {
      var index = Math.min(page * perView, slides.length - perView);
      return slides[Math.max(0, index)].offsetLeft - slides[0].offsetLeft;
    }

    function goTo(page) {
      current = (page + pages) % pages;
      track.scrollTo({ left: pageOffset(current), behavior: reduceMotion ? 'auto' : 'smooth' });
      updateUI();
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      // No celular (1 avaliação por vez) seriam bolinhas demais: mostra um contador "1 / 18"
      if (pages > MAX_DOTS) {
        var counter = document.createElement('span');
        counter.className = 'carousel__counter';
        counter.setAttribute('aria-hidden', 'true');
        dotsWrap.appendChild(counter);
        return;
      }
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', 'Mostrar grupo ' + (i + 1) + ' de ' + pages);
        dot.addEventListener('click', (function (p) {
          return function () { goTo(p); restart(); };
        })(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateUI() {
      var counter = dotsWrap.querySelector('.carousel__counter');
      if (counter) {
        counter.textContent = (current + 1) + ' / ' + pages;
        return;
      }
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    }

    // Sincroniza o indicador quando o usuário arrasta/rola com o dedo ou trackpad
    var scrollTimeout;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var best = 0;
        var bestDist = Infinity;
        for (var p = 0; p < pages; p++) {
          var d = Math.abs(pageOffset(p) - track.scrollLeft);
          if (d < bestDist) { bestDist = d; best = p; }
        }
        current = best;
        updateUI();
      }, 120);
    }, { passive: true });

    /* Rotação automática: pausa com mouse em cima, foco do teclado, aba oculta ou fora da tela */
    function tick() { goTo(current + 1); }
    function shouldRun() { return playing && !hovering && !focused && inView && !document.hidden; }
    function restart() {
      clearInterval(timer);
      timer = shouldRun() ? setInterval(tick, INTERVAL) : null;
    }

    function setPlaying(value) {
      playing = value;
      playBtn.setAttribute('aria-label', playing ? 'Pausar rotação automática' : 'Retomar rotação automática');
      playBtn.querySelector('use').setAttribute('href', playing ? '#i-pause' : '#i-play');
      restart();
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });
    playBtn.addEventListener('click', function () { setPlaying(!playing); });

    track.addEventListener('mouseenter', function () { hovering = true; restart(); });
    track.addEventListener('mouseleave', function () { hovering = false; restart(); });
    track.addEventListener('focusin', function () { focused = true; restart(); });
    track.addEventListener('focusout', function () { focused = false; restart(); });
    track.addEventListener('pointerdown', function () { restart(); });
    document.addEventListener('visibilitychange', restart);

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        restart();
      }, { threshold: 0.3 }).observe(root);
    } else {
      inView = true;
    }

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        measure();
        track.scrollTo({ left: pageOffset(current), behavior: 'auto' });
      }, 150);
    });

    measure();
    setPlaying(playing);
  }
})();
