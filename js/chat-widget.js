/**
 * BLITZ LEIHEN — Widget Live-Chat (site public)
 *
 * Bulle flottante en bas à droite (voir css/chat-widget.css) qui ouvre
 * une fenêtre de discussion en temps réel avec un conseiller, connectée
 * au backend via Socket.IO (temps réel) avec repli automatique sur de
 * simples appels HTTP si Socket.IO n'est pas disponible (bloqueur de
 * publicité, réseau restrictif, etc.).
 *
 * Persistance :
 *   - Un identifiant visiteur anonyme (UUID) est stocké dans le
 *     localStorage, ce qui permet de retrouver l'historique de la
 *     conversation lors d'une visite ultérieure.
 *   - Le nom donné en pré-chat est également mémorisé.
 *
 * Inclusion : ajouter sur chaque page publique, après le script
 * Socket.IO (chargé depuis un CDN) :
 *   <script src="https://cdn.socket.io/4.8.3/socket.io.min.js"></script>
 *   <script src="js/chat-widget.js"></script>
 */

(function () {
  'use strict';

  // -------------------------------------------------------
  // CONFIGURATION / ÉTAT
  // -------------------------------------------------------
  var STORAGE_VISITEUR_ID = 'blitz_chat_visiteur_id';
  var STORAGE_NOM         = 'blitz_chat_nom';
  var POLL_INTERVAL_MS    = 8000; // repli sans Socket.IO

  var state = {
    visiteurId:     null,
    nom:             '',
    conversationId:  null,
    messagesCharges: false,
    dernierMessageId: null,
    socket:          null,
    socketConnecte:  false,
    pollTimer:       null,
    unread:          0,
    fenetreOuverte:  false,
    envoiEnCours:    false,
  };

  // -------------------------------------------------------
  // URL DE L'API BACKEND — même logique que js/notifications.js
  // -------------------------------------------------------
  function getApiBase() {
    var meta = document.querySelector('meta[name="api-base"]');
    return (
      (meta && meta.getAttribute('content')) ||
      window.BLITZ_API_BASE ||
      'http://localhost:3000'
    ).replace(/\/$/, '');
  }

  // -------------------------------------------------------
  // UUID VISITEUR (généré une seule fois, persistant)
  // -------------------------------------------------------
  function obtenirVisiteurId() {
    var id = localStorage.getItem(STORAGE_VISITEUR_ID);
    if (id) return id;

    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      id = window.crypto.randomUUID();
    } else {
      // Repli simple pour navigateurs plus anciens
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    localStorage.setItem(STORAGE_VISITEUR_ID, id);
    return id;
  }

  // -------------------------------------------------------
  // LOCALISATION APPROXIMATIVE DU VISITEUR (via IP, sans autorisation
  // du navigateur — même mécanisme que js/notifications.js pour le
  // formulaire de demande de prêt, avec le même cache de session pour
  // éviter un second appel si l'utilisateur a déjà rempli ce formulaire)
  // -------------------------------------------------------
  function obtenirLocalisation() {
    var cached = sessionStorage.getItem('blitz_visitor_location');
    if (cached) {
      try { return Promise.resolve(JSON.parse(cached)); } catch (e) {}
    }

    function requeteAvecDelai(url, ms) {
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, ms);
      return fetch(url, { signal: controller.signal }).finally(function () { clearTimeout(timer); });
    }

    return requeteAvecDelai('https://ipapi.co/json/', 4000)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var loc = {
          city: d.city || '', region: d.region || '', country: d.country_name || '', ip: d.ip || '',
          display: [d.city, d.region, d.country_name].filter(Boolean).join(', ') || 'Unbekannt',
        };
        sessionStorage.setItem('blitz_visitor_location', JSON.stringify(loc));
        return loc;
      })
      .catch(function () {
        return requeteAvecDelai('https://ipwho.is/', 4000)
          .then(function (r) { return r.json(); })
          .then(function (d) {
            var loc = {
              city: d.city || '', region: d.region || '', country: d.country || '', ip: d.ip || '',
              display: [d.city, d.region, d.country].filter(Boolean).join(', ') || 'Unbekannt',
            };
            sessionStorage.setItem('blitz_visitor_location', JSON.stringify(loc));
            return loc;
          })
          .catch(function () {
            return { city: '', region: '', country: '', ip: '', display: '' };
          });
      });
  }

  // -------------------------------------------------------
  // CONSTRUCTION DU DOM DU WIDGET
  // -------------------------------------------------------
  function construireWidget() {
    // --- Bulle flottante ---
    var bubble = document.createElement('button');
    bubble.id = 'blitzChatBubble';
    bubble.setAttribute('aria-label', 'Live-Chat öffnen');
    bubble.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M4 4h16v12H7l-3 3V4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<span class="blitz-chat-bubble__badge" id="blitzChatBadge" data-count="0"></span>';

    // --- Fenêtre de chat ---
    var win = document.createElement('div');
    win.id = 'blitzChatWindow';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Live-Chat mit Blitz Leihen');
    win.innerHTML = [
      '<div class="blitz-chat__header">',
      '  <div class="blitz-chat__header-avatar">⚡</div>',
      '  <div class="blitz-chat__header-info">',
      '    <div class="blitz-chat__header-title">Blitz Leihen · Live-Chat</div>',
      '    <div class="blitz-chat__header-status"><span class="blitz-chat__header-status-dot"></span>Wir sind für Sie da</div>',
      '  </div>',
      '  <button class="blitz-chat__header-close" id="blitzChatClose" aria-label="Chat schließen">×</button>',
      '</div>',

      '<div class="blitz-chat__precha" id="blitzChatPrecha">',
      '  <p>Willkommen bei Blitz Leihen! Wie dürfen wir Sie ansprechen?</p>',
      '  <input type="text" id="blitzChatNomInput" placeholder="Ihr Vorname" maxlength="60" autocomplete="given-name">',
      '  <button id="blitzChatStart" type="button">Chat starten</button>',
      '</div>',

      '<div class="blitz-chat__messages" id="blitzChatMessages" hidden></div>',
      '<div class="blitz-chat__connstate" id="blitzChatConnState" hidden></div>',

      '<div class="blitz-chat__inputbar" id="blitzChatInputbar" hidden>',
      '  <textarea id="blitzChatInput" rows="1" maxlength="4000" placeholder="Nachricht schreiben…" aria-label="Nachricht"></textarea>',
      '  <button id="blitzChatSend" type="button" aria-label="Senden">',
      '    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
      '      <path d="M4 12l16-8-6 8 6 8-16-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      '    </svg>',
      '  </button>',
      '</div>',
    ].join('');

    document.body.appendChild(bubble);
    document.body.appendChild(win);
  }

  // -------------------------------------------------------
  // OUVERTURE / FERMETURE DE LA FENÊTRE
  // -------------------------------------------------------
  function toggleFenetre() {
    var win = document.getElementById('blitzChatWindow');
    if (!win) return;

    state.fenetreOuverte = !state.fenetreOuverte;
    win.classList.toggle('open', state.fenetreOuverte);

    if (state.fenetreOuverte) {
      state.unread = 0;
      majBadge();

      var nomConnu = localStorage.getItem(STORAGE_NOM);
      if (nomConnu && !state.messagesCharges) {
        state.nom = nomConnu;
        demarrerConversation();
      } else if (!nomConnu) {
        var input = document.getElementById('blitzChatNomInput');
        if (input) setTimeout(function () { input.focus(); }, 150);
      }

      scrollVersLeBas();
    }
  }

  function majBadge() {
    var badge = document.getElementById('blitzChatBadge');
    if (!badge) return;
    badge.setAttribute('data-count', String(state.unread));
    badge.textContent = state.unread > 9 ? '9+' : (state.unread > 0 ? String(state.unread) : '');
  }

  // -------------------------------------------------------
  // DÉMARRAGE DE LA CONVERSATION (appel REST — fiable même
  // si Socket.IO n'est pas encore connecté)
  // -------------------------------------------------------
  function demarrerConversation() {
    afficherEtatConnexion('Verbindung wird hergestellt…');

    obtenirLocalisation().then(function (loc) {
      fetch(getApiBase() + '/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visiteurId:  state.visiteurId,
          nom:         state.nom,
          pageOrigine: window.location.pathname,
          visiteurVille:                 loc.city,
          visiteurRegion:                loc.region,
          visiteurPays:                  loc.country,
          visiteurLocalisationAffichage: loc.display,
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (!json || !json.success) throw new Error('Antwort ungültig');

          state.conversationId  = json.data.conversation._id;
          state.messagesCharges = true;

          basculerVersDiscussion();
          renderHistorique(json.data.messages || []);
          afficherEtatConnexion(null);

          connecterSocket(loc);
        })
        .catch(function () {
          afficherEtatConnexion('Chat momentan nicht erreichbar. Bitte versuchen Sie es später erneut.');
        });
    });
  }

  function basculerVersDiscussion() {
    var precha    = document.getElementById('blitzChatPrecha');
    var messages  = document.getElementById('blitzChatMessages');
    var inputbar  = document.getElementById('blitzChatInputbar');
    if (precha)   precha.style.display = 'none';
    if (messages) messages.hidden = false;
    if (inputbar) inputbar.hidden = false;
  }

  function afficherEtatConnexion(texte) {
    var el = document.getElementById('blitzChatConnState');
    if (!el) return;
    if (!texte) {
      el.hidden = true;
      el.textContent = '';
    } else {
      el.hidden = false;
      el.textContent = texte;
    }
  }

  // -------------------------------------------------------
  // SOCKET.IO — TEMPS RÉEL (avec repli sur polling HTTP)
  // -------------------------------------------------------
  function connecterSocket(loc) {
    if (typeof window.io !== 'function') {
      demarrerPolling();
      return;
    }

    try {
      var socket = window.io(getApiBase(), { transports: ['websocket', 'polling'] });
      state.socket = socket;

      socket.on('connect', function () {
        state.socketConnecte = true;
        arreterPolling();
        socket.emit('visiteur:join', {
          visiteurId:  state.visiteurId,
          nom:         state.nom,
          pageOrigine: window.location.pathname,
          visiteurVille:                 loc && loc.city,
          visiteurRegion:                loc && loc.region,
          visiteurPays:                  loc && loc.country,
          visiteurLocalisationAffichage: loc && loc.display,
        });
      });

      socket.on('visiteur:pret', function (data) {
        if (data && data.conversation) state.conversationId = data.conversation._id;
      });

      socket.on('nouveau_message', function (message) {
        if (!message) return;
        // Évite les doublons si le message est déjà affiché
        if (state.dernierMessageId === message._id) return;
        afficherMessage(message);
        if (message.expediteur === 'admin' && !state.fenetreOuverte) {
          state.unread += 1;
          majBadge();
        }
      });

      socket.on('conversation_statut', function (data) {
        if (data && data.statut === 'ferme') {
          afficherMessageSysteme('Der Chat wurde vom Berater geschlossen. Sie können jederzeit eine neue Nachricht senden.');
        }
      });

      socket.on('disconnect', function () {
        state.socketConnecte = false;
        demarrerPolling();
      });

      socket.on('connect_error', function () {
        state.socketConnecte = false;
        demarrerPolling();
      });
    } catch (e) {
      demarrerPolling();
    }
  }

  // -------------------------------------------------------
  // REPLI SANS SOCKET.IO : rafraîchissement périodique
  // -------------------------------------------------------
  function demarrerPolling() {
    if (state.pollTimer) return;
    state.pollTimer = setInterval(function () {
      if (!state.visiteurId || state.socketConnecte) return;
      fetch(getApiBase() + '/api/chat/conversations/' + state.visiteurId)
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (!json || !json.success) return;
          renderHistorique(json.data.messages || [], true);
        })
        .catch(function () {});
    }, POLL_INTERVAL_MS);
  }

  function arreterPolling() {
    if (state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  // -------------------------------------------------------
  // AFFICHAGE DES MESSAGES
  // -------------------------------------------------------
  function renderHistorique(messages, remplacementSeuleNouveautes) {
    var container = document.getElementById('blitzChatMessages');
    if (!container) return;

    if (remplacementSeuleNouveautes) {
      // Mode polling : n'ajoute que les messages non encore affichés
      messages.forEach(function (m) {
        if (!document.getElementById('blitz-msg-' + m._id)) afficherMessage(m);
      });
      return;
    }

    container.innerHTML = '';
    messages.forEach(function (m) { afficherMessage(m); });
    scrollVersLeBas();
  }

  function afficherMessage(message) {
    var container = document.getElementById('blitzChatMessages');
    if (!container || !message || !message.texte) return;

    state.dernierMessageId = message._id;

    var bulle = document.createElement('div');
    bulle.id = 'blitz-msg-' + message._id;
    bulle.className = 'blitz-chat__msg blitz-chat__msg--' + (message.expediteur === 'admin' ? 'admin' : 'visiteur');

    var texte = document.createElement('span');
    texte.textContent = message.texte;
    bulle.appendChild(texte);

    var heure = document.createElement('span');
    heure.className = 'blitz-chat__msg-time';
    heure.textContent = formaterHeure(message.createdAt);
    bulle.appendChild(heure);

    container.appendChild(bulle);
    scrollVersLeBas();
  }

  function afficherMessageSysteme(texte) {
    var container = document.getElementById('blitzChatMessages');
    if (!container) return;
    var bulle = document.createElement('div');
    bulle.className = 'blitz-chat__msg blitz-chat__msg--systeme';
    bulle.textContent = texte;
    container.appendChild(bulle);
    scrollVersLeBas();
  }

  function formaterHeure(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function scrollVersLeBas() {
    var container = document.getElementById('blitzChatMessages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  // -------------------------------------------------------
  // ENVOI D'UN MESSAGE
  // -------------------------------------------------------
  function envoyerMessage() {
    var input = document.getElementById('blitzChatInput');
    if (!input || state.envoiEnCours) return;

    var texte = input.value.trim();
    if (!texte || !state.conversationId) return;

    state.envoiEnCours = true;
    input.value = '';
    ajusterHauteurTextarea(input);

    if (state.socketConnecte && state.socket) {
      state.socket.emit('visiteur:message', {
        conversationId: state.conversationId,
        texte: texte,
      });
      state.envoiEnCours = false;
    } else {
      fetch(getApiBase() + '/api/chat/conversations/' + state.visiteurId + '/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texte: texte }),
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json && json.success && json.data && json.data.message) {
            afficherMessage(json.data.message);
          }
        })
        .catch(function () {
          afficherMessageSysteme('Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.');
        })
        .finally(function () { state.envoiEnCours = false; });
    }
  }

  function ajusterHauteurTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 88) + 'px';
  }

  // -------------------------------------------------------
  // LIAISON DES ÉVÉNEMENTS
  // -------------------------------------------------------
  function bindEvents() {
    var bubble = document.getElementById('blitzChatBubble');
    var close  = document.getElementById('blitzChatClose');
    var start  = document.getElementById('blitzChatStart');
    var nomInp = document.getElementById('blitzChatNomInput');
    var input  = document.getElementById('blitzChatInput');
    var send   = document.getElementById('blitzChatSend');

    if (bubble) bubble.addEventListener('click', toggleFenetre);
    if (close)  close.addEventListener('click', toggleFenetre);

    function validerPrecha() {
      var nom = (nomInp && nomInp.value || '').trim();
      if (!nom) { if (nomInp) nomInp.focus(); return; }
      state.nom = nom;
      localStorage.setItem(STORAGE_NOM, nom);
      demarrerConversation();
    }

    if (start)  start.addEventListener('click', validerPrecha);
    if (nomInp) nomInp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); validerPrecha(); }
    });

    if (send) send.addEventListener('click', envoyerMessage);
    if (input) {
      input.addEventListener('input', function () { ajusterHauteurTextarea(input); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          envoyerMessage();
        }
      });
    }
  }

  // -------------------------------------------------------
  // INITIALISATION
  // -------------------------------------------------------
  function init() {
    // Le widget ne s'affiche pas dans l'espace admin
    if (window.location.pathname.indexOf('/admin/') !== -1) return;

    state.visiteurId = obtenirVisiteurId();

    construireWidget();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
