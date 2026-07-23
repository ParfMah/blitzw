/**
 * BLITZ LEIHEN — Admin : fonctions communes à toutes les pages
 * (dashboard.html, chat.html, kunden.html, einstellungen.html)
 *
 * Regroupe ici pour éviter que chaque page réimplémente sa propre
 * version (et son propre lot de bugs) de :
 *   - la configuration de l'URL de l'API
 *   - la vérification d'authentification
 *   - le chargement des infos utilisateur dans la sidebar
 *   - la déconnexion
 *   - l'ouverture/fermeture de la sidebar sur mobile (avec fond
 *     semi-transparent cliquable pour la refermer)
 *   - les notifications "toast" non bloquantes
 */
window.BlitzAdmin = (function() {
  'use strict';

  // --- Configuration API (identique à toutes les pages) ---
  var API_BASE = (
    document.querySelector('meta[name="api-base"]')?.getAttribute('content') ||
    window.BLITZ_API_BASE ||
    'https://79-108-162-55.sslip.io'
  ).replace(/\/$/, '') + '/api';

  // --- Authentification ---
  function checkAuth() {
    var token = sessionStorage.getItem('blitz_admin_token');
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }
    return token;
  }

  function authHeaders() {
    var token = sessionStorage.getItem('blitz_admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
  }

  function logout() {
    sessionStorage.removeItem('blitz_admin_token');
    sessionStorage.removeItem('blitz_admin_user');
    window.location.href = 'login.html';
  }

  // --- Infos utilisateur affichées dans la sidebar / topbar ---
  function loadUserInfo() {
    var userStr = sessionStorage.getItem('blitz_admin_user');
    if (!userStr) return null;
    try {
      var user = JSON.parse(userStr);
      var initial = user.name ? user.name[0].toUpperCase() : 'A';
      ['userAvatar', 'topbarAvatar'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = initial;
      });
      var nameEl = document.getElementById('userName');
      if (nameEl) nameEl.textContent = user.name || 'Administrator';
      return user;
    } catch (e) {
      return null;
    }
  }

  // --- Sidebar mobile : ouverture / fermeture + fond cliquable ---
  function initSidebar() {
    var toggleBtn = document.getElementById('sidebarToggle');
    var sidebar   = document.getElementById('adminSidebar');
    var backdrop  = document.getElementById('sidebarBackdrop');

    function close() {
      if (sidebar)  sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }
    function toggle() {
      if (sidebar)  sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('open');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);
    if (backdrop)  backdrop.addEventListener('click', close);

    // Referme automatiquement la sidebar quand on tape un lien de
    // navigation sur mobile (sinon elle reste ouverte par-dessus la
    // page suivante le temps du chargement).
    if (sidebar) {
      sidebar.querySelectorAll('.admin-nav__link').forEach(function(link) {
        link.addEventListener('click', close);
      });
    }

    // Affiche le bouton hamburger uniquement en dessous de 1024px
    if (toggleBtn && window.innerWidth <= 1024) {
      toggleBtn.style.display = 'flex';
    }

    // Lien "E-Mails" : fonctionnalité pas encore branchée à un
    // historique complet côté serveur — on informe clairement au
    // lieu de laisser un lien qui ne fait rien.
    var navEmailsSoon = document.getElementById('navEmailsSoon');
    if (navEmailsSoon) {
      navEmailsSoon.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('E-Mail-Verlauf: bald verfügbar');
      });
    }
  }

  // --- Toast (message temporaire non bloquant) ---
  function showToast(message) {
    var wrap = document.getElementById('adminToastWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'admin-toast-wrap';
      wrap.id = 'adminToastWrap';
      document.body.appendChild(wrap);
    }
    var toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = message;
    wrap.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2800);
  }

  return {
    API_BASE: API_BASE,
    checkAuth: checkAuth,
    authHeaders: authHeaders,
    logout: logout,
    loadUserInfo: loadUserInfo,
    initSidebar: initSidebar,
    showToast: showToast,
  };
})();
