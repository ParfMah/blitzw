/**
 * BLITZ LEIHEN — Hero Slider
 *
 * Système de diaporama automatique pour les sections Hero.
 * Les images sont chargées depuis Cloudinary via une configuration externe.
 *
 * Configuration :
 *   - Remplacer les URLs "LIEN_CLOUDINARY_IMAGE_X" par vos liens Cloudinary réels
 *   - Le slider fonctionne immédiatement après remplacement des liens
 *
 * Fonctionnalités :
 *   - Défilement automatique toutes les 5 secondes
 *   - Navigation manuelle (boutons précédent/suivant)
 *   - Indicateurs de slides (points cliquables)
 *   - Animation CSS des textes à chaque transition
 *   - Pause au survol de la souris
 *   - Barre de progression animée
 */

(function() {
  'use strict';

  // -------------------------------------------------------
  // CONFIGURATION DES IMAGES CLOUDINARY
  // Remplacer les valeurs ci-dessous par vos URLs Cloudinary.
  // Chaque objet slide contient :
  //   - image    : URL Cloudinary de l'image de fond
  //   - eyebrow  : texte en haut (badge / surtitre)
  //   - title    : titre principal en grand
  //   - text     : sous-titre / description
  //   - btnPrimary : texte du bouton principal
  //   - btnPrimaryHref : lien du bouton principal
  //   - btnSecondary : texte du bouton secondaire (optionnel)
  //   - btnSecondaryHref : lien du bouton secondaire
  // -------------------------------------------------------
  var HERO_SLIDES = [
    {
      image:            'LIEN_CLOUDINARY_IMAGE_1',
      eyebrow:          'Ihr Finanzpartner in Deutschland',
      title:            'Schnelle Kredite, die Ihr Leben verändern',
      text:             'Bis zu 150.000 € in weniger als 48 Stunden. Einfache Konditionen, transparente Zinsen und ein persönlicher Berater an Ihrer Seite.',
      btnPrimary:       'Jetzt Kredit beantragen',
      btnPrimaryHref:   'kontakt.html',
      btnSecondary:     'Unsere Angebote entdecken',
      btnSecondaryHref: 'kredite.html'
    },
    {
      image:            'LIEN_CLOUDINARY_IMAGE_2',
      eyebrow:          'Immobilienfinanzierung',
      title:            'Ihr Traumhaus mit der richtigen Finanzierung',
      text:             'Günstige Baufinanzierungen mit Top-Konditionen. Wir begleiten Sie von der ersten Idee bis zum Einzug in Ihr neues Zuhause.',
      btnPrimary:       'Immobilienkredit anfragen',
      btnPrimaryHref:   'immobilien.html',
      btnSecondary:     'Mehr erfahren',
      btnSecondaryHref: 'ueber-uns.html'
    },
    {
      image:            'LIEN_CLOUDINARY_IMAGE_3',
      eyebrow:          'Flexibel & Sicher',
      title:            'Finanzlösungen für jeden Bedarf',
      text:             'Ob Privatkredit, Autofinanzierung oder Umschuldung — bei Blitz Leihen finden Sie die passende Lösung für Ihre finanzielle Situation.',
      btnPrimary:       'Kostenlose Beratung starten',
      btnPrimaryHref:   'kontakt.html',
      btnSecondary:     'Alle Kredite anzeigen',
      btnSecondaryHref: 'kredite.html'
    }
  ];

  // -------------------------------------------------------
  // ÉTAT DU SLIDER
  // -------------------------------------------------------
  var currentIndex = 0;    // Slide actuellement affichée
  var autoTimer    = null; // Référence du setInterval pour le défilement auto
  var isAnimating  = false; // Verrou pour éviter les transitions simultanées

  // Durée entre chaque slide (en millisecondes)
  var SLIDE_DURATION = 5000;

  // -------------------------------------------------------
  // INITIALISATION
  // Récupère le conteneur du slider et génère les slides dynamiquement
  // -------------------------------------------------------
  function init() {
    var container = document.getElementById('heroSlider');
    if (!container) return; // Pas de slider sur cette page

    // Génération des slides HTML à partir de la configuration
    buildSlides(container);

    // Récupération des éléments de contrôle
    var dots    = container.querySelectorAll('.hero-dot');
    var btnPrev = container.querySelector('#heroPrev');
    var btnNext = container.querySelector('#heroNext');
    var progress = container.querySelector('.hero-progress');

    // Affichage de la première slide
    showSlide(0, container);

    // Boutons précédent / suivant
    if (btnPrev) {
      btnPrev.addEventListener('click', function() {
        var prev = (currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
        goToSlide(prev, container);
        resetAutoplay(container);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function() {
        var next = (currentIndex + 1) % HERO_SLIDES.length;
        goToSlide(next, container);
        resetAutoplay(container);
      });
    }

    // Points de navigation (dots)
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        if (i !== currentIndex) {
          goToSlide(i, container);
          resetAutoplay(container);
        }
      });
    });

    // Pause au survol de la souris
    container.addEventListener('mouseenter', function() { pauseAutoplay(); });
    container.addEventListener('mouseleave', function() { startAutoplay(container); });

    // Démarrage du défilement automatique
    startAutoplay(container);
  }

  // -------------------------------------------------------
  // CONSTRUCTION DES SLIDES EN HTML
  // -------------------------------------------------------
  function buildSlides(container) {
    var slidesWrap = container.querySelector('.hero-slides');
    if (!slidesWrap) return;

    HERO_SLIDES.forEach(function(slide, i) {
      var el = document.createElement('div');
      el.className = 'hero-slide';
      el.setAttribute('aria-label', 'Slide ' + (i + 1));

      el.innerHTML = [
        '<img class="hero-slide__bg" src="' + slide.image + '" alt="' + slide.eyebrow + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '">',
        '<div class="hero-slide__overlay"></div>',
        '<div class="hero-slide__content">',
        '  <div class="container">',
        '    <span class="hero-slide__eyebrow">' + slide.eyebrow + '</span>',
        '    <h1 class="hero-slide__title">' + slide.title + '</h1>',
        '    <p class="hero-slide__text">' + slide.text + '</p>',
        '    <div class="hero-slide__actions">',
        '      <a href="' + slide.btnPrimaryHref + '" class="btn btn-accent btn-lg">' + slide.btnPrimary + '</a>',
        slide.btnSecondary ? '      <a href="' + slide.btnSecondaryHref + '" class="btn btn-outline-white btn-lg">' + slide.btnSecondary + '</a>' : '',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');

      slidesWrap.appendChild(el);
    });
  }

  // -------------------------------------------------------
  // AFFICHAGE D'UNE SLIDE (sans animation de sortie)
  // -------------------------------------------------------
  function showSlide(index, container) {
    var slides = container.querySelectorAll('.hero-slide');
    var dots   = container.querySelectorAll('.hero-dot');

    slides.forEach(function(s, i) {
      s.classList.toggle('active', i === index);
    });

    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === index);
    });

    currentIndex = index;
  }

  // -------------------------------------------------------
  // TRANSITION VERS UNE SLIDE (avec verrou anti-spam)
  // -------------------------------------------------------
  function goToSlide(index, container) {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    showSlide(index, container);

    // Libération du verrou après la durée de transition CSS
    setTimeout(function() { isAnimating = false; }, 800);
  }

  // -------------------------------------------------------
  // AUTOPLAY — Défilement automatique
  // -------------------------------------------------------
  function startAutoplay(container) {
    pauseAutoplay(); // Nettoyage préventif

    autoTimer = setInterval(function() {
      var next = (currentIndex + 1) % HERO_SLIDES.length;
      goToSlide(next, container);

      // Redémarre l'animation de la barre de progression
      restartProgress(container);
    }, SLIDE_DURATION);
  }

  function pauseAutoplay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAutoplay(container) {
    pauseAutoplay();
    restartProgress(container);
    startAutoplay(container);
  }

  // -------------------------------------------------------
  // BARRE DE PROGRESSION ANIMÉE
  // Redémarre l'animation CSS de la barre de progression
  // -------------------------------------------------------
  function restartProgress(container) {
    var bar = container.querySelector('.hero-progress');
    if (!bar) return;

    // Forcer un reflow pour redémarrer l'animation CSS
    bar.style.animation = 'none';
    bar.offsetHeight; // Lecture du layout pour forcer le reflow
    bar.style.animation = 'heroProgress ' + (SLIDE_DURATION / 1000) + 's linear';
  }

  // Lancement de l'initialisation une fois le DOM prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
