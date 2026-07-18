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
  /* ============================================================
     EFFET 3 — RECOUVREMENT DIRECTIONNEL (galerie des offres de crédit)
     Chaque nouvelle image glisse depuis le haut, le bas, la gauche ou
     la droite (rotation cyclique) pour venir recouvrir entièrement
     l'image précédente, qui elle ne bouge, ne s'estompe et ne se
     floute jamais avant d'être cachée.
     ============================================================ */
  function initDistortion(containerId, images) {
    var container = document.getElementById(containerId);
    if (!container || !images || !images.length) return;

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

    // Rotation harmonieuse des 4 directions d'entrée, dans cet ordre,
    // pour que les photos arrivent tour à tour du haut, de la droite,
    // du bas puis de la gauche plutôt que toujours du même côté.
    var DIRECTIONS = ['top', 'right', 'bottom', 'left'];
    var dirIndex = 0;
    var DIR_CLASSES = ['enter-from-top', 'enter-from-bottom', 'enter-from-left', 'enter-from-right'];

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

      var direction = DIRECTIONS[dirIndex % DIRECTIONS.length];
      dirIndex++;

      // Repositionne la nouvelle image hors-champ (côté choisi), sans
      // transition, AVANT de déclencher l'animation d'entrée.
      nextEl.classList.remove.apply(nextEl.classList, DIR_CLASSES.concat(['is-entering']));
      nextEl.classList.add('enter-from-' + direction);

      // Force le navigateur à appliquer cette position de départ avant
      // d'activer la transition (sinon le glissement ne se joue pas).
      void nextEl.offsetWidth;

      requestAnimationFrame(function () {
        nextEl.classList.add('is-entering');
      });

      dotEls[current].classList.remove('active');
      dotEls[next].classList.add('active');

      // Une fois le glissement terminé : la nouvelle image devient l'image
      // "au repos" ; l'ancienne repasse simplement en arrière-plan, sans
      // avoir jamais bougé, pâli ni flouté entre-temps.
      setTimeout(function () {
        prevEl.classList.remove('is-active');
        nextEl.classList.remove.apply(nextEl.classList, DIR_CLASSES.concat(['is-entering']));
        nextEl.classList.add('is-active');
      }, 980);

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
    initDistortion('offersDistortionGallery', MEDIA.offersGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exposé pour d'éventuels usages futurs sur d'autres pages
  window.BlitzBgEffects = {
    initDistortion: initDistortion
  };

})();
