/**
 * BLITZ LEIHEN — Animations au scroll via GSAP ScrollTrigger
 *
 * Améliore la révélation au scroll des éléments .animate-on-scroll :
 * au lieu d'un simple fondu individuel (système de secours dans
 * js/main.js, basé sur IntersectionObserver), les éléments partageant
 * un même conteneur direct apparaissent désormais en cascade légère
 * (stagger), pour un rendu plus premium.
 *
 * SÉCURITÉ / DÉGRADATION GRACIEUSE :
 * - Si GSAP/ScrollTrigger ne se chargent pas (CDN bloqué, absence de
 *   réseau), ce script ne fait rien : js/main.js prend le relais avec
 *   son propre système de révélation (IntersectionObserver), garantissant
 *   que le contenu reste TOUJOURS visible même sans ce script.
 * - Respecte la préférence système "prefers-reduced-motion": affiche
 *   directement le contenu sans animation si l'utilisateur l'a demandé.
 * - js/main.js détecte la présence de GSAP/ScrollTrigger et désactive
 *   alors son propre système pour éviter tout doublon (voir initScrollAnimations).
 */
(function () {
  'use strict';

  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    if (reduceMotion) {
      // Affiche directement tout le contenu, sans animation ni délai.
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // Regroupe les éléments par conteneur parent direct : les éléments
    // d'un même groupe (ex: les cartes d'une grille) apparaissent en
    // cascade légère (stagger) plutôt que tous en même temps.
    var groups = new Map();
    elements.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach(function (group) {
      // État de départ cohérent avec le CSS existant (.animate-on-scroll)
      gsap.set(group, { opacity: 0, y: 24 });

      ScrollTrigger.batch(group, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.12,
            onComplete: function () {
              // Ajoute la classe pour rester cohérent avec le reste du
              // site (au cas où un futur script s'appuierait dessus).
              batch.forEach(function (el) { el.classList.add('is-visible'); });
            }
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
