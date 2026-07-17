/**
 * BLITZ LEIHEN — Effets visuels avancés (Ken Burns / Crossfade / Distorsion)
 *
 * Ce script est chargé (avec `defer`) sur TOUTES les pages publiques mais
 * ne construit un effet que si son conteneur existe dans le DOM de la
 * page courante — aucun impact sur le temps de rendu des autres pages.
 *
 * ============================================================
 * CONFIGURATION CLOUDINARY — MODIFIER UNIQUEMENT CETTE SECTION
 * ============================================================
 * Chaque entrée qui ne commence pas par "http" affiche un encart de
 * remplacement (mêmes conventions que js/hero-mega.js) tant que vous
 * n'avez pas collé vos liens Cloudinary définitifs à la place.
 */
(function () {
  'use strict';

  var MEDIA = {

    /* --- Effet 1 : Ken Burns — Hero de la page d'accueil (index.html) ---
       5 ambiances variées pour un fond riche qui ne se répète pas trop vite. */
    heroKenBurns: [
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145820/familie-finanzberatung-zuhause.webp', alt: 'Familie plant gemeinsam ihre Finanzierung',
        desc: 'Ambiance chaleureuse : famille/couple autour d\'une table, discussion financière — 1920×1080px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145820/deutsche-stadtsilhouette-daemmerung.webp', alt: 'Moderne deutsche Stadtsilhouette bei Dämmerung',
        desc: 'Skyline urbaine allemande moderne au crépuscule — 1920×1080px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145821/kreditberater-kundengespraech-buero.webp', alt: 'Berater im Gespräch mit zufriedenem Kunden',
        desc: 'Conseiller financier et client, bureau moderne, ambiance de confiance — 1920×1080px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145820/einfamilienhaus-mit-garten-deutschland.webp', alt: 'Einfamilienhaus mit Garten in Deutschland',
        desc: 'Maison individuelle avec jardin, lumière douce — 1920×1080px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145819/digitaler-kreditantrag-smartphone.webp', alt: 'Digitale Kreditanwendung auf Smartphone und Laptop',
        desc: 'Ambiance digitale/tech, smartphone et laptop, tons bleu marine — 1920×1080px' }
    ],

    /* --- Effet 2 (b) : Crossfade pur — Section Témoignages (index.html) --- */
    testimonialsCrossfade: [
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145826/zufriedener-kunde-portraet-blitz-leihen.webp', alt: 'Zufriedene Kunden nach Kreditzusage', desc: 'Portrait lifestyle client souriant, tons clairs et chauds — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145821/familie-vor-eigenheim-finanziert.webp', alt: 'Familie vor ihrem finanzierten Zuhause', desc: 'Famille devant sa maison, ambiance positive — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145821/paar-finanzplanung-laptop-wohnzimmer.webp', alt: 'Paar mit Laptop bei der Finanzplanung', desc: 'Couple planifiant ensemble, intérieur lumineux — 1600×900px' }
    ],

    /* --- Effet 3 : Distorsion fluide — Galerie des offres (kredite.html) ---
       Une image par produit de crédit affiché sur la page. */
    offersGallery: [
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145824/privatkredit-blitz-leihen.webp',   alt: 'Privatkredit für persönliche Projekte',      eyebrow: 'Privatkredit',        title: 'Für Ihre persönlichen Projekte', desc: 'Client heureux, projet personnel (voyage, achat) — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145821/immobilienfinanzierung-traumhaus.webp',     alt: 'Immobilienfinanzierung für das Eigenheim',   eyebrow: 'Immobilienfinanzierung', title: 'Ihr Traumhaus wird Realität', desc: 'Maison individuelle moderne — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145820/autokredit-neuwagen-finanzierung.webp',     alt: 'Autofinanzierung für den Neuwagenkauf',      eyebrow: 'Autofinanzierung',    title: 'Ihr neues Auto, sofort verfügbar', desc: 'Véhicule neuf, concession moderne — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145825/renovierungskredit-modernisierung-kueche.webp',    alt: 'Renovierungskredit für die Modernisierung',  eyebrow: 'Renovierungskredit',  title: 'Investieren Sie in Ihr Zuhause', desc: 'Rénovation intérieure moderne, artisan au travail — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145820/hypothekenkredit-immobiliensicherheit.webp',       alt: 'Hypothekenkredit mit Immobiliensicherheit',  eyebrow: 'Hypothekenkredit',    title: 'Großzügiger Kapitalspielraum', desc: 'Grande propriété, ambiance patrimoniale — 1600×900px' },
      { src: 'https://res.cloudinary.com/duramdsjz/image/upload/v1784145825/umschuldung-kredit-zusammenfassen.webp',    alt: 'Umschuldung mehrerer bestehender Kredite',   eyebrow: 'Umschuldung',        title: 'Eine einzige, günstigere Rate', desc: 'Personne sereine consultant ses finances — 1600×900px' }
    ]

    /* Les photos de fond de tous les hero (Kontakt, Kredite, Immobilien,
       Über uns, etc.) et le fond du footer sont désormais 100% statiques
       (CSS pur, voir css/bg-effects.css) afin d'éviter tout flash de fond
       bleu le temps que ce script se charge. Leurs URLs Cloudinary sont
       directement dans le HTML (attribut style="--hero-photo:url(...)")
       et dans css/bg-effects.css pour le footer. */
  };

  /* ----------------------------------------------------------
     UTILITAIRE : un média est-il une vraie URL ou un placeholder ?
  ---------------------------------------------------------- */
  function estUrlReelle(src) {
    return !!src && src.indexOf('http') === 0;
  }

  function creerPlaceholder(desc, label) {
    var ph = document.createElement('div');
    ph.className = 'media-ph';
    ph.innerHTML =
      '<span class="media-ph__icon" aria-hidden="true">🖼️</span>' +
      '<strong class="media-ph__label">' + (label || 'Cloudinary-Bild') + '</strong>' +
      '<span class="media-ph__desc">' + desc + '</span>' +
      '<code class="media-ph__code">→ src Cloudinary in js/bg-effects.js eintragen</code>';
    return ph;
  }

  /* ============================================================
     EFFET 1 — KEN BURNS (zoom lent + crossfade)
     ============================================================ */
  function initKenBurns(containerId, images) {
    var container = document.getElementById(containerId);
    if (!container || !images || !images.length) return;

    var bg = document.createElement('div');
    bg.className = 'kb-bg';
    bg.setAttribute('role', 'img');
    bg.setAttribute('aria-label', 'Blitz Leihen — Vertrauensvolle Finanzierung in Deutschland');

    images.forEach(function (img, i) {
      var slide = document.createElement('div');
      slide.className = 'kb-bg__slide ' + (i % 2 === 0 ? 'kb-bg__slide--in' : 'kb-bg__slide--out') + (i === 0 ? ' is-active' : '');

      if (estUrlReelle(img.src)) {
        slide.style.backgroundImage = 'url(' + img.src + ')';
        slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      } else {
        slide.appendChild(creerPlaceholder(img.desc, img.alt));
      }
      bg.appendChild(slide);
    });

    // Overlay de contraste (cahier des charges §3)
    var overlay = document.createElement('div');
    overlay.className = 'bg-overlay-contrast';
    bg.appendChild(overlay);

    // Insertion en TOUT PREMIER enfant : reste derrière le contenu
    // injecté ensuite par hero-mega.js (track / nav / progress).
    container.insertBefore(bg, container.firstChild);

    // Rotation lente et continue, indépendante du carrousel de contenu
    var index = 0;
    setInterval(function () {
      var slides = bg.querySelectorAll('.kb-bg__slide');
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, 7000);
  }

  /* ============================================================
     EFFET 2 — CROSSFADE PUR (footer + témoignages)
     ============================================================ */
  function initCrossfade(containerId, images, options) {
    var container = document.getElementById(containerId);
    if (!container || !images || !images.length) return;

    options = options || {};
    var interval = options.interval || 6000;

    var bg = document.createElement('div');
    bg.className = 'cf-bg';
    bg.setAttribute('role', 'img');
    bg.setAttribute('aria-label', options.ariaLabel || 'Blitz Leihen');

    images.forEach(function (img, i) {
      var slide = document.createElement('div');
      slide.className = 'cf-bg__slide' + (i === 0 ? ' is-active' : '');
      if (estUrlReelle(img.src)) {
        slide.style.backgroundImage = 'url(' + img.src + ')';
      } else {
        slide.appendChild(creerPlaceholder(img.desc, img.alt));
      }
      bg.appendChild(slide);
    });

    var overlay = document.createElement('div');
    overlay.className = 'bg-overlay-contrast' + (options.lightOverlay ? ' bg-overlay-contrast--light' : '');
    bg.appendChild(overlay);

    container.insertBefore(bg, container.firstChild);

    var index = 0;
    setInterval(function () {
      var slides = bg.querySelectorAll('.cf-bg__slide');
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, interval);
  }

  /* ============================================================
     EFFET 3 — DISTORSION FLUIDE (galerie des offres de crédit)
     Fondu + flou + léger zoom, renforcés par une distorsion SVG
     (feTurbulence/feDisplacementMap) pendant la fenêtre de transition.
     ============================================================ */
  function injecterFiltreSVG() {
    if (document.getElementById('dg-distort-filter')) return;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';
    svg.innerHTML =
      '<filter id="dg-distort-filter" x="-20%" y="-20%" width="140%" height="140%">' +
      '  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise">' +
      '    <animate attributeName="baseFrequency" values="0.008 0.012;0.02 0.028;0.008 0.012" dur="6s" repeatCount="indefinite"/>' +
      '  </feTurbulence>' +
      '  <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">' +
      '    <animate attributeName="scale" values="0;55;0" dur="1.1s" begin="indefinite" fill="freeze" id="dg-distort-anim"/>' +
      '  </feDisplacementMap>' +
      '</filter>';
    document.body.appendChild(svg);
  }

  function initDistortion(containerId, images) {
    var container = document.getElementById(containerId);
    if (!container || !images || !images.length) return;

    injecterFiltreSVG();

    var dots = document.createElement('div');
    dots.className = 'distort-gallery__dots';

    images.forEach(function (img, i) {
      var slide = document.createElement('div');
      slide.className = 'distort-gallery__slide' + (i === 0 ? ' is-active' : '');

      if (estUrlReelle(img.src)) {
        slide.style.backgroundImage = 'url(' + img.src + ')';
      } else {
        slide.appendChild(creerPlaceholder(img.desc, img.alt));
      }
      slide.setAttribute('role', 'img');
      slide.setAttribute('aria-label', img.alt);
      container.appendChild(slide);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'distort-gallery__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', img.eyebrow + ' anzeigen');
      dot.addEventListener('click', function () { goTo(i); });
      dots.appendChild(dot);
    });

    var caption = document.createElement('div');
    caption.className = 'distort-gallery__caption';
    container.appendChild(caption);
    container.appendChild(dots);

    var slides = container.querySelectorAll('.distort-gallery__slide');
    var dotEls = dots.querySelectorAll('.distort-gallery__dot');
    var current = 0;

    function updateCaption(i) {
      caption.innerHTML =
        '<span class="distort-gallery__caption-eyebrow">' + images[i].eyebrow + '</span>' +
        '<span class="distort-gallery__caption-title">' + images[i].title + '</span>';
    }
    updateCaption(0);

    function goTo(next) {
      if (next === current) return;
      var prevEl = slides[current];
      var nextEl = slides[next];

      // Active la distorsion SVG pendant la transition, puis la retire
      prevEl.classList.add('is-distorting');
      nextEl.classList.add('is-distorting');
      var anim = document.getElementById('dg-distort-anim');
      if (anim && anim.beginElement) { try { anim.beginElement(); } catch (e) {} }

      prevEl.classList.remove('is-active');
      prevEl.classList.add('is-leaving');
      nextEl.classList.add('is-active');

      dotEls[current].classList.remove('active');
      dotEls[next].classList.add('active');

      setTimeout(function () {
        prevEl.classList.remove('is-leaving', 'is-distorting');
        nextEl.classList.remove('is-distorting');
      }, 1150);

      current = next;
      updateCaption(current);
    }

    setInterval(function () {
      goTo((current + 1) % slides.length);
    }, 5500);
  }

  /* ----------------------------------------------------------
     INITIALISATION — asynchrone, ne bloque jamais le rendu
     (script chargé avec `defer` + exécution après DOMContentLoaded)
  ---------------------------------------------------------- */
  function init() {
    initKenBurns('heroMega', MEDIA.heroKenBurns);
    initCrossfade('testimonialsCrossfadeBg', MEDIA.testimonialsCrossfade, {
      interval: 7000,
      lightOverlay: true,
      ariaLabel: 'Zufriedene Blitz Leihen Kunden'
    });
    initDistortion('offersDistortionGallery', MEDIA.offersGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exposé pour d'éventuels usages futurs sur d'autres pages
  window.BlitzBgEffects = {
    initKenBurns: initKenBurns,
    initCrossfade: initCrossfade,
    initDistortion: initDistortion
  };

})();
