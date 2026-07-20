/**
 * BLITZ LEIHEN — Notifications (interface vers le backend)
 *
 * CE MODULE NE GÈRE PLUS LES EMAILS DIRECTEMENT.
 * Le backend Express (Nodemailer) est désormais le seul responsable
 * de l'envoi des emails (confirmation client + alerte conseiller).
 * Cela évitait un double envoi lorsque les deux systèmes coexistaient.
 *
 * Ce module fournit maintenant :
 *
 *   1. getLocation()        — localisation approximative du visiteur par IP
 *                              (ville/région/pays, sans popup de permission)
 *                              Les données sont ensuite envoyées au backend
 *                              avec la demande pour enrichir le profil.
 *
 *   2. getApiBase()         — URL de l'API backend, lue depuis le meta tag
 *                              <meta name="api-base" content="https://...">
 *                              ou la variable window.BLITZ_API_BASE
 *                              → aucune URL hardcodée dans le code.
 *
 *   3. sendAbandonment()    — Envoie une alerte d'abandon au backend
 *                              via POST /api/demandes/abandon.
 *                              Le backend l'envoie ensuite au conseiller.
 */

(function () {
  'use strict';

  // -------------------------------------------------------
  // URL DE L'API BACKEND — centralisée ici pour tout le site
  // Lue dans cet ordre de priorité :
  //   1. <meta name="api-base" content="https://monbackend.com">
  //      (méthode recommandée pour la production)
  //   2. window.BLITZ_API_BASE = "https://..."
  //      (assignée par un script inline en haut de page)
  //   3. https://79-108-162-55.sslip.io (développement local)
  // -------------------------------------------------------
  function getApiBase() {
    var meta = document.querySelector('meta[name="api-base"]');
    return (
      (meta && meta.getAttribute('content')) ||
      window.BLITZ_API_BASE ||
      'https://79-108-162-55.sslip.io'
    ).replace(/\/$/, '');
  }

  // -------------------------------------------------------
  // LOCALISATION DU VISITEUR PAR IP (automatique, sans popup)
  // Mise en cache dans sessionStorage pour ne faire qu'un seul
  // appel réseau par visite, même si le visiteur ouvre le chat
  // ET soumet le formulaire dans la même session.
  // -------------------------------------------------------
  function fetchWithTimeout(url, ms) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, ms);
    return fetch(url, { signal: controller.signal }).finally(function () {
      clearTimeout(timer);
    });
  }

  function getLocation() {
    var cached = sessionStorage.getItem('blitz_visitor_location');
    if (cached) {
      try { return Promise.resolve(JSON.parse(cached)); } catch (e) {}
    }

    return fetchWithTimeout('https://ipapi.co/json/', 4000)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var loc = {
          city:    d.city || '',
          region:  d.region || '',
          country: d.country_name || '',
          ip:      d.ip || '',
          display: [d.city, d.region, d.country_name].filter(Boolean).join(', ') || 'Unbekannt'
        };
        sessionStorage.setItem('blitz_visitor_location', JSON.stringify(loc));
        return loc;
      })
      .catch(function () {
        // Service de secours si ipapi.co est indisponible
        return fetchWithTimeout('https://ipwho.is/', 4000)
          .then(function (r) { return r.json(); })
          .then(function (d) {
            var loc = {
              city:    d.city || '',
              region:  d.region || '',
              country: d.country || '',
              ip:      d.ip || '',
              display: [d.city, d.region, d.country].filter(Boolean).join(', ') || 'Unbekannt'
            };
            sessionStorage.setItem('blitz_visitor_location', JSON.stringify(loc));
            return loc;
          })
          .catch(function () {
            return { city: '', region: '', country: '', ip: '', display: 'Standort nicht verfügbar' };
          });
      });
  }

  // -------------------------------------------------------
  // NUMÉRO DE DOSSIER (généré côté client pour affichage
  // immédiat dans le formulaire — le backend génère le sien
  // propre et c'est celui-ci qui fait foi dans la base de données.
  // Les deux numéros sont identiques en format mais pas en valeur :
  // le vrai numéro est renvoyé par le backend et affiché
  // dans l'écran de confirmation via showSuccess(data)).
  // -------------------------------------------------------
  function generateReference() {
    var year = new Date().getFullYear();
    var rand = Math.floor(100000 + Math.random() * 900000);
    return 'BL-' + year + '-' + rand;
  }

  // -------------------------------------------------------
  // ENVOI D'ALERTE D'ABANDON AU BACKEND
  // Appelé par forms.js via l'événement visibilitychange.
  // Le backend (POST /api/demandes/abandon) envoie ensuite
  // l'email d'alerte au conseiller.
  // -------------------------------------------------------
  function sendAbandonment(formData, location) {
    var apiBase = getApiBase();

    try {
      // navigator.sendBeacon est préféré pour les envois en fin de session
      // (plus fiable que fetch lors d'un beforeunload/visibilitychange),
      // mais sendBeacon ne supporte pas les en-têtes → on passe JSON en blob.
      var payload = JSON.stringify(Object.assign({}, formData, {
        visiteurVille:                 location ? location.city    : '',
        visiteurRegion:                location ? location.region  : '',
        visiteurPays:                  location ? location.country : '',
        visiteurLocalisationAffichage: location ? location.display : 'Unbekannt',
      }));

      if (typeof navigator.sendBeacon === 'function') {
        var blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(apiBase + '/api/demandes/abandon', blob);
      } else {
        // Fallback fetch (keepalive pour survivre à la fermeture de page)
        fetch(apiBase + '/api/demandes/abandon', {
          method:    'POST',
          headers:   { 'Content-Type': 'application/json' },
          body:      payload,
          keepalive: true,
        }).catch(function () {});
      }
    } catch (e) {
      // Silencieux : on ne bloque jamais le parcours client
    }
  }

  // API publique exposée à forms.js et au reste du site
  window.BlitzNotify = {
    getLocation:       getLocation,
    generateReference: generateReference,
    sendAbandonment:   sendAbandonment,
    getApiBase:        getApiBase,
  };

})();

