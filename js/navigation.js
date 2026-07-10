/**
 * BLITZ LEIHEN — Navigation
 *
 * Gère :
 * 1. Header sticky (changement d'apparence au scroll)
 * 2. Menu hamburger mobile (ouverture/fermeture de la sidebar)
 * 3. Overlay derrière la sidebar
 * 4. Fermeture par touche Échap ou clic en dehors
 * 5. Marquage du lien actif selon la page courante
 */

(function() {
  'use strict';

  // Variables déclarées ici, assignées dans init()
  // pour garantir que template.js a eu le temps d'injecter le header
  var header, navToggle, navMobile, navOverlay, navClose;

  function init() {
    header     = document.getElementById('siteHeader');
    navToggle  = document.getElementById('navToggle');
    navMobile  = document.getElementById('navMobile');
    navOverlay = document.getElementById('navOverlay');
    navClose   = document.getElementById('navClose');

  // -------------------------------------------------------
  // 1. HEADER STICKY AU SCROLL
  // Ajoute la classe .scrolled quand on dépasse 60px de scroll
  // Ce qui change le fond du header (transparent → blanc)
  // -------------------------------------------------------
  function handleScroll() {
    if (!header) return;

    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Écoute le scroll avec optimisation via requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Vérification initiale (page rechargée en milieu de scroll)
  handleScroll();

  // -------------------------------------------------------
  // 2. OUVERTURE DE LA SIDEBAR MOBILE
  // -------------------------------------------------------
  function openMenu() {
    if (!navMobile || !navOverlay) return;

    navMobile.classList.add('open');
    navOverlay.classList.add('visible');
    document.body.classList.add('menu-open');

    // Accessibilité : focus sur le premier lien du menu
    const firstLink = navMobile.querySelector('.nav-mobile__link, .nav-mobile__close');
    if (firstLink) {
      setTimeout(function() { firstLink.focus(); }, 100);
    }

    // Mise à jour ARIA
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('open');
  }

  // -------------------------------------------------------
  // 3. FERMETURE DE LA SIDEBAR MOBILE
  // -------------------------------------------------------
  function closeMenu() {
    if (!navMobile || !navOverlay) return;

    navMobile.classList.remove('open');
    navOverlay.classList.remove('visible');
    document.body.classList.remove('menu-open');

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('open');
    }
  }

  // Bouton hamburger → ouvre/ferme
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMobile && navMobile.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  // Bouton × dans la sidebar → ferme
  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  // Clic sur l'overlay → ferme
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Touche Échap → ferme
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });

  // -------------------------------------------------------
  // 4. MARQUAGE DU LIEN ACTIF
  // Compare l'URL actuelle avec le href de chaque lien nav
  // -------------------------------------------------------
  function setActiveLinks() {
    // Récupère le chemin de la page actuelle (ex: "/kredite.html")
    const currentPath = window.location.pathname;

    // Tous les liens de navigation (desktop + mobile)
    const allNavLinks = document.querySelectorAll(
      '.nav-desktop__link, .nav-mobile__link'
    );

    allNavLinks.forEach(function(link) {
      const linkPath = link.getAttribute('href');
      if (!linkPath) return;

      // Extraction du nom de fichier pour comparaison simple
      const linkFile = linkPath.split('/').pop() || 'index.html';
      const currentFile = currentPath.split('/').pop() || 'index.html';

      // Cas spécial : accueil (index.html ou /)
      const isHome = (currentFile === '' || currentFile === 'index.html');
      const linkIsHome = (linkFile === 'index.html' || linkFile === '');

      if (isHome && linkIsHome) {
        link.classList.add('active');
      } else if (!isHome && linkFile === currentFile) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveLinks();

  // -------------------------------------------------------
  // 5. FERMETURE DU MENU AU CLIC SUR UN LIEN (mobile)
  // (Le loader.js gère la transition, le menu se ferme avant)
  // NOTE : ce bloc doit être DANS init(), car navMobile n'est
  // assigné qu'ici. Le placer hors de init() faisait que
  // navMobile valait toujours "undefined" au moment de l'appel,
  // et les liens du menu mobile ne fermaient jamais la sidebar.
  // -------------------------------------------------------
  if (navMobile) {
    navMobile.querySelectorAll('.nav-mobile__link').forEach(function(link) {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });
  }
  } // fin init()

  // -------------------------------------------------------
  // 6. RESIZE — Fermeture du menu si on passe en desktop
  // -------------------------------------------------------
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });

  // Lancement sécurisé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
