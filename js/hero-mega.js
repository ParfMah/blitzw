/**
 * BLITZ LEIHEN — Hero Mega v2
 *
 * Architecture :
 *   4 panels navigables (auto + manuel + swipe)
 *   Chaque panel → slideshow PLEINE LARGEUR (1 image à la fois)
 *   Direction d'entrée par panel :
 *     LTR : image entre depuis la GAUCHE  → sort à DROITE
 *     RTL : image entre depuis la DROITE  → sort à GAUCHE
 *     TTB : image entre depuis le HAUT    → sort en BAS
 *     BTU : image entre depuis le BAS     → sort en HAUT
 *
 * ============================================================
 * CONFIGURATION CLOUDINARY — MODIFIER ICI UNIQUEMENT
 * ============================================================
 */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONFIGURATION : 4 panels × 3 photos chacun
  ---------------------------------------------------------- */
  var CONFIG = {
    autoplay:       true,
    panelInterval:  7000,   /* ms entre chaque panel principal */
    photoInterval:  2800,   /* ms entre chaque photo dans un panel */
    transitionMs:   480,    /* ms durée transition photo (doit = CSS) */

    panels: [

      /* ====================================================
         PANEL 1 — Gauche → Droite (LTR)
      ==================================================== */
      {
        direction: 'ltr',
        eyebrow:   'Blitz Leihen — Ihr Finanzpartner',
        title:     'Schnelle Kredite für jede Lebenslage',
        text:      'Bis zu 150.000 € in weniger als 48 Stunden. Einfacher Antrag, transparente Zinsen, persönlicher Berater.',
        btnPrimary:      'Jetzt Kredit beantragen ⚡',
        btnPrimaryHref:  'kontakt.html',
        btnSecondary:    'Alle Kreditprodukte',
        btnSecondaryHref:'kredite.html',
        photos: [
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-kunde-kreditvertrag-lachend_hvnefd.webp', alt: 'Glücklicher Kunde mit Kreditvertrag',
            caption: 'Kredit in 48 Stunden',
            desc: 'CLIENT SATISFAIT tenant un contrat de crédit — ambiance chaleureuse et professionnelle — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-finanzberater-beratungsgespraech_nhkcni.webp', alt: 'Professioneller Finanzberater',
            caption: 'Persönliche Beratung',
            desc: 'CONSEILLER FINANCIER souriant face au client, bureau moderne — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-familie-wohnzimmer-gluecklich_ya6ki8.webp', alt: 'Familie mit finanziertem Wunsch',
            caption: 'Finanzielle Freiheit',
            desc: 'FAMILLE HEUREUSE dans leur salon, ambiance de réussite et sérénité — 800×600px' }
        ]
      },

      /* ====================================================
         PANEL 2 — Droite → Gauche (RTL)
      ==================================================== */
      {
        direction: 'rtl',
        eyebrow:   'Immobilienfinanzierung',
        title:     'Ihr Traumhaus — finanziert mit Top-Konditionen',
        text:      'Baufinanzierungen ab 1,8% eff. p.a. Von der Eigentumswohnung bis zum Einfamilienhaus.',
        btnPrimary:      'Immobilienkredit anfragen',
        btnPrimaryHref:  'immobilien.html',
        btnSecondary:    'Konditionen ansehen',
        btnSecondaryHref:'immobilien.html',
        photos: [
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-einfamilienhaus-garten-modern_rglahy.webp', alt: 'Modernes Einfamilienhaus in Deutschland',
            caption: 'Traumhaus verwirklichen',
            desc: 'MAISON INDIVIDUELLE MODERNE avec jardin, style contemporain, ciel bleu — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849032/blitz-leihen-hero-eigentumswohnung-interieur_bbtfus.webp', alt: 'Elegante Eigentumswohnung',
            caption: 'Eigentumswohnung',
            desc: 'INTÉRIEUR APPARTEMENT élégant avec lumière naturelle, mobilier design — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-paar-hausschluessel-uebergabe1_mikuxd.webp', alt: 'Paar vor neuem Haus',
            caption: 'Schlüsselübergabe',
            desc: 'COUPLE souriant devant leur nouvelle maison, tenant les clés — 800×600px' }
        ]
      },

      /* ====================================================
         PANEL 3 — Haut → Bas (TTB)
      ==================================================== */
      {
        direction: 'ttb',
        eyebrow:   'Sicher & Transparent',
        title:     'Ihre Vorteile bei Blitz Leihen',
        text:      'BaFin-reguliert, DSGVO-konform, 15.000+ zufriedene Kunden. Kostenlose Erstberatung ohne Verpflichtungen.',
        btnPrimary:      'Kostenlos beraten lassen',
        btnPrimaryHref:  'kontakt.html',
        btnSecondary:    'Über uns',
        btnSecondaryHref:'ueber-uns.html',
        photos: [
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-smartphone-kredit-app_yzlmin.webp', alt: 'Digitale Kreditanwendung auf Smartphone',
            caption: '100% digital & sicher',
            desc: 'SMARTPHONE avec app de crédit sur écran, fond lumineux moderne — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849032/blitz-leihen-hero-bafin-sicherheit-tresor_zxtkwd.webp', alt: 'BaFin Sicherheit und Zertifizierung',
            caption: 'BaFin-reguliert',
            desc: 'SÉCURITÉ FINANCIÈRE — coffre fort, bouclier ou façade banque allemande — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849037/blitz-leihen-hero-team-buero-modern_k5iek0.webp', alt: 'Professionelles Team Blitz Leihen',
            caption: 'Unser Expertenteam',
            desc: 'ÉQUIPE BUREAU MODERNE — conseillers en open space, ambiance dynamique — 800×600px' }
        ]
      },

      /* ====================================================
         PANEL 4 — Bas → Haut (BTU)
      ==================================================== */
      {
        direction: 'btu',
        eyebrow:   'Deutsche Qualität seit 2015',
        title:     'Vertrauen Sie auf 10 Jahre Erfahrung',
        text:      '98% Kundenzufriedenheit, über 150 Mio. € ausgezahlte Kredite. Ihr langfristiger Finanzpartner.',
        btnPrimary:      'Unsere Geschichte',
        btnPrimaryHref:  'ueber-uns.html',
        btnSecondary:    'Kundenstimmen',
        btnSecondaryHref:'ueber-uns.html',
        photos: [
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849032/blitz-leihen-hero-berlin-skyline-panorama_gqw7uk.webp', alt: 'Berlin Stadtansicht Deutschland',
            caption: 'Gegründet in Berlin 2015',
            desc: 'PANORAMA BERLIN ou grande ville allemande, skyline moderne, ciel bleu — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-familie-mehrgenerationen-zuhause_jbrasy.webp', alt: 'Glückliche Familie zu Hause',
            caption: '15.000+ zufriedene Kunden',
            desc: 'FAMILLE MULTIGÉNÉRATIONNELLE dans leur maison, ambiance chaleureuse — 800×600px' },
          { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1783849033/blitz-leihen-hero-geschaeftshandschlag-partnerschaft_jqgame.webp', alt: 'Geschäftshandschlag Partnerschaft',
            caption: 'Ihr Partner für die Zukunft',
            desc: 'POIGNÉE DE MAIN professionnelle, bureau élégant en arrière-plan — 800×600px' }
        ]
      }

    ]
  };

  /* ----------------------------------------------------------
     ÉTAT GLOBAL
  ---------------------------------------------------------- */
  var state = {
    currentPanel: 0,
    panelTimer:   null,
    photoTimers:  [],      /* un timer par panel */
    photoIndex:   [0,0,0,0],
    animating:    false,
    touchStartX:  0,
    touchStartY:  0
  };

  /* ----------------------------------------------------------
     CONSTRUCTION DE TOUT LE HERO
  ---------------------------------------------------------- */
  function build() {
    var hero = document.getElementById('heroMega');
    if (!hero) return;

    /* Track des 4 panels */
    var track = document.createElement('div');
    track.className = 'hero-panels-track';
    track.id = 'heroPanelsTrack';

    CONFIG.panels.forEach(function (panel, i) {
      track.appendChild(buildPanel(panel, i));
    });

    /* Navigation dots + flèches */
    var nav = document.createElement('div');
    nav.className = 'hero-mega__nav';
    nav.innerHTML =
      '<button class="hero-mega__arrow" id="heroPrev" aria-label="Zurück">&#8592;</button>' +
      '<div class="hero-mega__dots" id="heroDots">' +
        CONFIG.panels.map(function (_, i) {
          return '<button class="hero-mega__dot' + (i === 0 ? ' active' : '') + '" ' +
                 'data-target="' + i + '" aria-label="Abschnitt ' + (i+1) + '"></button>';
        }).join('') +
      '</div>' +
      '<button class="hero-mega__arrow" id="heroNext" aria-label="Weiter">&#8594;</button>';

    /* Barre de progression */
    var progress = document.createElement('div');
    progress.className = 'hero-mega__progress';
    progress.innerHTML = '<div class="hero-mega__progress-bar" id="heroProgressBar"></div>';

    hero.appendChild(track);
    hero.appendChild(nav);
    hero.appendChild(progress);

    bindEvents(hero);
    activatePanel(0, true);
    startPanelTimer();
    startAllPhotoTimers();
  }

  /* ----------------------------------------------------------
     CONSTRUCTION D'UN PANEL
  ---------------------------------------------------------- */
  function buildPanel(panel, idx) {
    var el = document.createElement('div');
    el.className = 'hero-panel hero-panel--' + panel.direction;
    el.setAttribute('data-panel', idx);

    /* === ZONE PHOTOS : slideshow 1 image pleine largeur === */
    var zone = document.createElement('div');
    zone.className = 'hero-panel__photos-zone';

    /* Les 3 photos : position absolute, pleine taille */
    panel.photos.forEach(function (photo, pi) {
      var item = document.createElement('div');
      /* La classe de direction sert au CSS pour savoir d'où entrer */
      item.className = 'hero-photo-item hero-photo-item--' + panel.direction
                     + (pi === 0 ? ' active' : '');
      item.setAttribute('data-photo', pi);

      if (photo.src && photo.src.indexOf('http') === 0) {
        /* Image Cloudinary réelle */
        item.innerHTML =
          '<img src="' + photo.src + '" alt="' + photo.alt + '" class="hero-photo-img" loading="' + (pi === 0 ? 'eager' : 'lazy') + '">' +
          '<div class="hero-photo-caption"><span>' + photo.caption + '</span></div>';
      } else {
        /* Placeholder avec instructions */
        item.innerHTML =
          '<div class="hero-photo-placeholder">' +
            '<span class="hero-photo-placeholder__icon">📸</span>' +
            '<strong class="hero-photo-placeholder__label">' + photo.caption + '</strong>' +
            '<span class="hero-photo-placeholder__desc">' + photo.desc + '</span>' +
            '<code class="hero-photo-placeholder__code">→ Remplacer ce div par: &lt;img src="URL_CLOUDINARY" class="hero-photo-img"&gt;</code>' +
          '</div>' +
          '<div class="hero-photo-caption"><span>' + photo.caption + '</span></div>';
      }

      zone.appendChild(item);
    });

    /* === CONTENU TEXTE === */
    var content = document.createElement('div');
    content.className = 'hero-panel__content';
    content.innerHTML =
      '<span class="hero-panel__eyebrow">' + panel.eyebrow + '</span>' +
      '<h2 class="hero-panel__title">' + panel.title + '</h2>' +
      '<p class="hero-panel__text">' + panel.text + '</p>' +
      '<div class="hero-panel__actions">' +
        '<a href="' + panel.btnPrimaryHref + '" class="btn btn-accent btn-lg">' + panel.btnPrimary + '</a>' +
        (panel.btnSecondary
          ? '<a href="' + panel.btnSecondaryHref + '" class="btn btn-outline-white">' + panel.btnSecondary + '</a>'
          : '') +
      '</div>';

    el.appendChild(zone);
    el.appendChild(content);
    return el;
  }

  /* ----------------------------------------------------------
     SLIDESHOW PHOTO D'UN PANEL (1 image à la fois)
     La direction détermine d'où entre et où sort chaque image
  ---------------------------------------------------------- */
  function nextPhoto(panelIdx) {
    var panelEl = document.querySelector('.hero-panel[data-panel="' + panelIdx + '"]');
    if (!panelEl) return;

    var items  = panelEl.querySelectorAll('.hero-photo-item');
    if (items.length < 2) return;

    var prev   = state.photoIndex[panelIdx];
    var next   = (prev + 1) % items.length;

    state.photoIndex[panelIdx] = next;

    /* Sortie de l'ancienne image (va dans la direction opposée à l'entrée) */
    items[prev].classList.add('exiting');
    items[prev].classList.remove('active');

    /* Entrée de la nouvelle */
    items[next].classList.add('active');

    /* Nettoyage après la transition CSS */
    setTimeout(function () {
      items[prev].classList.remove('exiting');
    }, CONFIG.transitionMs + 50);
  }

  function startAllPhotoTimers() {
    CONFIG.panels.forEach(function (_, i) {
      var offset = i * 900; /* décalage pour que les panels ne changent pas en même temps */
      state.photoTimers[i] = setInterval(function () {
        nextPhoto(i);
      }, CONFIG.photoInterval + offset);
    });
  }

  function stopAllPhotoTimers() {
    state.photoTimers.forEach(function (t) { clearInterval(t); });
    state.photoTimers = [];
  }

  /* ----------------------------------------------------------
     NAVIGATION ENTRE PANELS
  ---------------------------------------------------------- */
  function activatePanel(n, immediate) {
    var total = CONFIG.panels.length;
    n = ((n % total) + total) % total;
    if (!immediate && n === state.currentPanel) return;
    if (state.animating && !immediate) return;

    state.animating   = true;
    state.currentPanel = n;

    var track = document.getElementById('heroPanelsTrack');
    if (track) {
      /* 4 panels → chacun fait 25% du track */
      track.style.transform = 'translateX(-' + (n * 25) + '%)';
    }

    document.querySelectorAll('.hero-panel').forEach(function (p, i) {
      p.setAttribute('aria-hidden', i !== n ? 'true' : 'false');
    });

    document.querySelectorAll('.hero-mega__dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === n);
    });

    restartProgress();

    setTimeout(function () { state.animating = false; }, 900);
  }

  /* Correction : utiliser CONFIG.panels.length à la place */
  function goToPanel(n) {
    var total = CONFIG.panels.length;
    n = ((n % total) + total) % total;
    if (n === state.currentPanel || state.animating) return;

    state.animating    = true;
    state.currentPanel = n;

    var track = document.getElementById('heroPanelsTrack');
    if (track) track.style.transform = 'translateX(-' + (n * 25) + '%)';

    document.querySelectorAll('.hero-panel').forEach(function (p, i) {
      p.setAttribute('aria-hidden', i !== n ? 'true' : 'false');
    });

    document.querySelectorAll('.hero-mega__dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === n);
    });

    restartProgress();
    setTimeout(function () { state.animating = false; }, 900);
  }

  /* ----------------------------------------------------------
     AUTOPLAY PANELS
  ---------------------------------------------------------- */
  function startPanelTimer() {
    clearInterval(state.panelTimer);
    state.panelTimer = setInterval(function () {
      goToPanel(state.currentPanel + 1);
    }, CONFIG.panelInterval);
  }

  function resetPanelTimer() {
    startPanelTimer();
    restartProgress();
  }

  /* ----------------------------------------------------------
     BARRE DE PROGRESSION
  ---------------------------------------------------------- */
  function restartProgress() {
    var bar = document.getElementById('heroProgressBar');
    if (!bar) return;
    bar.style.animation = 'none';
    bar.offsetHeight;
    bar.style.animation = 'heroProgressBar ' + (CONFIG.panelInterval / 1000) + 's linear forwards';
  }

  /* ----------------------------------------------------------
     ÉVÉNEMENTS
  ---------------------------------------------------------- */
  function bindEvents(hero) {
    var btnPrev = document.getElementById('heroPrev');
    var btnNext = document.getElementById('heroNext');

    if (btnPrev) btnPrev.addEventListener('click', function () {
      goToPanel(state.currentPanel - 1);
      resetPanelTimer();
    });

    if (btnNext) btnNext.addEventListener('click', function () {
      goToPanel(state.currentPanel + 1);
      resetPanelTimer();
    });

    document.querySelectorAll('.hero-mega__dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToPanel(parseInt(dot.getAttribute('data-target'), 10));
        resetPanelTimer();
      });
    });

    hero.addEventListener('mouseenter', function () { clearInterval(state.panelTimer); });
    hero.addEventListener('mouseleave', function () { if (CONFIG.autoplay) startPanelTimer(); });

    /* Swipe mobile */
    hero.addEventListener('touchstart', function (e) {
      state.touchStartX = e.changedTouches[0].screenX;
      state.touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    hero.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].screenX - state.touchStartX;
      var dy = e.changedTouches[0].screenY - state.touchStartY;
      if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 50) return;
      goToPanel(dx < 0 ? state.currentPanel + 1 : state.currentPanel - 1);
      resetPanelTimer();
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  function init() {
    var hero = document.getElementById('heroMega');
    if (!hero) return;
    build();
    /* Reset du photo index */
    state.photoIndex = CONFIG.panels.map(function () { return 0; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
