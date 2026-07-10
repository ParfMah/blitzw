/**
 * BLITZ LEIHEN — Loader de transition (version corrigée)
 *
 * BUG CORRIGÉ #1 : transitionend ne se déclenche pas de façon fiable
 * sur un élément injecté dynamiquement via outerHTML.
 * SOLUTION : setTimeout simple à la place de transitionend.
 *
 * Le loader se cache dès que le DOM est prêt (DOMContentLoaded),
 * sans attendre les images externes — ce qui évite le blocage infini
 * quand les URLs Cloudinary ne sont pas encore renseignées.
 *
 * BUG CORRIGÉ #2 : boucle de chargement infinie au retour arrière.
 * Quand on clique un lien, un overlay #pageLoader est ajouté au DOM
 * juste AVANT la navigation (window.location.href). Si l'utilisateur
 * revient ensuite avec le bouton "retour" du navigateur/téléphone,
 * la plupart des navigateurs restaurent la page depuis leur cache
 * mémoire (bfcache) EXACTEMENT comme elle était au moment de la quitter
 * — c'est-à-dire avec cet overlay encore affiché à l'écran, puisque
 * le setTimeout qui le supprime n'a jamais pu s'exécuter (la page a
 * changé avant). Comme aucun événement JS ne se redéclenche dans ce
 * cas (DOMContentLoaded ne se relance pas depuis le bfcache), l'overlay
 * reste bloqué pour toujours → écran de chargement infini.
 * SOLUTION : l'événement "pageshow" se déclenche TOUJOURS quand une
 * page redevient visible, y compris depuis le bfcache. Sa propriété
 * event.persisted vaut true uniquement dans ce cas précis : on en
 * profite pour supprimer immédiatement tout loader resté affiché.
 */

(function() {
  'use strict';

  // -------------------------------------------------------
  // MASQUAGE DU LOADER
  // Utilise setTimeout au lieu de transitionend (plus fiable)
  // -------------------------------------------------------
  function hideLoader() {
    var loader = document.getElementById('pageLoader');
    if (!loader) return;

    // Déclenchement de l'animation CSS (opacity 1 → 0)
    loader.classList.add('fade-out');

    // Suppression du DOM après la transition (500ms = durée CSS)
    setTimeout(function() {
      var el = document.getElementById('pageLoader');
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 520);
  }

  // -------------------------------------------------------
  // SUPPRESSION IMMÉDIATE (sans animation) — utilisée pour le
  // retour depuis le bfcache, où l'overlay doit disparaître
  // instantanément plutôt que de rejouer un fondu.
  // -------------------------------------------------------
  function forceRemoveLoader() {
    var loader = document.getElementById('pageLoader');
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  // -------------------------------------------------------
  // DÉCLENCHEMENT AU DOM PRÊT
  // DOMContentLoaded = HTML analysé, pas besoin d'attendre les images.
  // Cela évite le blocage si des images externes ne se chargent pas.
  // -------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(hideLoader, 300);
    });
  } else {
    // DOM déjà prêt (script chargé en différé ou en bas de page)
    setTimeout(hideLoader, 300);
  }

  // -------------------------------------------------------
  // FIX BOUCLE INFINIE — Retour arrière / restauration bfcache
  // "pageshow" se déclenche à chaque affichage de la page, y compris
  // lors d'une restauration depuis le cache (retour arrière mobile,
  // geste de retour, bouton précédent du navigateur, etc.)
  // -------------------------------------------------------
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      // Page restaurée depuis le bfcache : tout overlay resté affiché
      // est obsolète, on le retire sans délai ni animation.
      forceRemoveLoader();
    }
  });

  // Filet de sécurité supplémentaire : si pour une quelconque raison
  // un loader est encore présent 2.5s après le chargement (cas
  // extrême non couvert par pageshow sur certains navigateurs),
  // on le retire pour ne jamais bloquer l'utilisateur indéfiniment.
  setTimeout(forceRemoveLoader, 2500);

  // -------------------------------------------------------
  // TRANSITION ENTRE LES PAGES
  // Crée un mini-loader léger avant la navigation interne
  // -------------------------------------------------------
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');

    // Ignorer : ancres, externes, mailto, tel, nouvel onglet, touches modificatrices
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('http') ||
      link.target === '_blank' ||
      e.ctrlKey || e.metaKey || e.shiftKey
    ) return;

    e.preventDefault();

    // Détermine le chemin du logo selon la profondeur de page
    var isAdmin = window.location.pathname.indexOf('/admin/') !== -1;
    var logo = isAdmin ? '../blitz_leihen_logo.webp' : 'blitz_leihen_logo.webp';

    // Création d'un loader léger pour la transition
    var overlay = document.createElement('div');
    overlay.id = 'pageLoader';
    overlay.className = 'page-loader';
    overlay.innerHTML =
      '<div class="page-loader__inner">' +
        '<div class="page-loader__ring"></div>' +
        '<img src="' + logo + '" alt="Blitz Leihen" class="page-loader__logo-img">' +
      '</div>';
    document.body.appendChild(overlay);

    // Navigation après un court délai (animation visible)
    setTimeout(function() {
      window.location.href = href;
    }, 280);
  });

  // Expose pour usage externe si besoin
  window.BlitzLoader = { hide: hideLoader, forceRemove: forceRemoveLoader };

})();
