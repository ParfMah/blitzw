/**
 * BLITZ LEIHEN — Template partagé
 *
 * Comme ce projet est en HTML/JS pur (sans serveur ni framework),
 * ce fichier injecte dynamiquement le header et le footer communs
 * sur toutes les pages, évitant la duplication de code HTML.
 *
 * Fonctionnement :
 *   - Cherche #siteHeaderPlaceholder dans le DOM → injecte le header
 *   - Cherche #siteFooterPlaceholder dans le DOM → injecte le footer
 *   - Cherche #pageLoaderPlaceholder → injecte le loader
 *   - Cherche #backToTopPlaceholder → injecte le bouton retour en haut
 *
 * Usage dans chaque page HTML :
 *   <div id="siteHeaderPlaceholder"></div>
 *   <div id="siteFooterPlaceholder"></div>
 *   <div id="pageLoaderPlaceholder"></div>
 */

(function() {
  'use strict';

  // -------------------------------------------------------
  // CHEMIN RELATIF DU LOGO
  // Adapté automatiquement selon la profondeur du dossier
  // (pages racine vs sous-dossier admin/)
  // -------------------------------------------------------
  var isInSubfolder = window.location.pathname.indexOf('/admin/') !== -1 ||
                       window.location.pathname.indexOf('/ratgeber/') !== -1;
  var logoPath      = isInSubfolder ? '../blitz_leihen_logo.webp' : 'blitz_leihen_logo.webp';
  var rootPath      = isInSubfolder ? '../' : '';

  // -------------------------------------------------------
  // HTML DU LOADER DE TRANSITION
  // -------------------------------------------------------
  // Structure minimale : un cercle + le logo. Sans texte, sans double anneau.
  var LOADER_HTML = [
    '<div id="pageLoader" class="page-loader" role="status" aria-label="Seite lädt...">',
    '  <div class="page-loader__inner">',
    '    <div class="page-loader__ring"></div>',
    '    <img src="' + logoPath + '" alt="Blitz Leihen" class="page-loader__logo-img">',
    '  </div>',
    '</div>'
  ].join('\n');

  // -------------------------------------------------------
  // HTML DU HEADER / NAVBAR
  // -------------------------------------------------------
  var HEADER_HTML = [
    '<header class="site-header" id="siteHeader" role="banner">',
    '  <div class="header-inner">',
    '',
    '    <!-- Logo Blitz Leihen -->',
    '    <a href="' + rootPath + 'index.html" class="site-logo" aria-label="Blitz Leihen – Startseite">',
    '      <img src="' + logoPath + '" alt="Blitz Leihen" class="site-logo__img" width="160" height="50">',
    '    </a>',
    '',
    '    <!-- Navigation Desktop -->',
    '    <nav class="nav-desktop" role="navigation" aria-label="Hauptnavigation">',
    '      <a href="' + rootPath + 'index.html"      class="nav-desktop__link">Startseite</a>',
    '      <a href="' + rootPath + 'kredite.html"    class="nav-desktop__link">Kredite</a>',
    '      <a href="' + rootPath + 'immobilien.html" class="nav-desktop__link">Immobilienfinanzierung</a>',
    '      <a href="' + rootPath + 'simulation.html" class="nav-desktop__link">Kreditrechner</a>',
    '      <a href="' + rootPath + 'ratgeber.html"   class="nav-desktop__link">Ratgeber</a>',
    '      <a href="' + rootPath + 'ueber-uns.html"  class="nav-desktop__link">Über uns</a>',
    '      <a href="' + rootPath + 'kontakt.html"    class="nav-desktop__link">Kontakt</a>',
    '      <a href="' + rootPath + 'kreditantrag.html" class="nav-desktop__link nav-desktop__cta">Kreditantrag stellen</a>',
    '    </nav>',
    '',
    '    <!-- Bouton Hamburger (mobile/tablette) -->',
    '    <button class="nav-toggle" id="navToggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="navMobile">',
    '      <span class="nav-toggle__bar"></span>',
    '      <span class="nav-toggle__bar"></span>',
    '      <span class="nav-toggle__bar"></span>',
    '    </button>',
    '  </div>',
    '</header>',
    '',
    '<!-- Overlay derrière la sidebar mobile -->',
    '<div class="nav-overlay" id="navOverlay" aria-hidden="true"></div>',
    '',
    '<!-- Sidebar Mobile (s\'ouvre de droite vers gauche) -->',
    '<nav class="nav-mobile" id="navMobile" role="navigation" aria-label="Mobile Navigation" aria-hidden="true">',
    '',
    '  <!-- En-tête de la sidebar -->',
    '  <div class="nav-mobile__header">',
    '    <a href="' + rootPath + 'index.html" class="site-logo nav-mobile__logo" aria-label="Blitz Leihen">',
    '      <img src="' + logoPath + '" alt="Blitz Leihen" class="site-logo__img" width="130" height="40">',
    '    </a>',
    '    <button class="nav-mobile__close" id="navClose" aria-label="Menü schließen">×</button>',
    '  </div>',
    '',
    '  <!-- Corps de la sidebar : liens de navigation -->',
    '  <div class="nav-mobile__body">',
    '    <a href="' + rootPath + 'index.html"      class="nav-mobile__link">',
    '      <span>🏠 Startseite</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'kredite.html"    class="nav-mobile__link">',
    '      <span>💶 Kredite</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'immobilien.html" class="nav-mobile__link">',
    '      <span>🏠 Immobilienfinanzierung</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'simulation.html" class="nav-mobile__link">',
    '      <span>🧮 Kreditrechner</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'zinssatz.html"   class="nav-mobile__link">',
    '      <span>📖 Wie wird Ihr Zinssatz berechnet?</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'ratgeber.html"   class="nav-mobile__link">',
    '      <span>📰 Ratgeber</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'ueber-uns.html"  class="nav-mobile__link">',
    '      <span>👥 Über uns</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '    <a href="' + rootPath + 'kontakt.html"    class="nav-mobile__link">',
    '      <span>✉ Kontakt</span>',
    '      <span class="nav-mobile__link-arrow">›</span>',
    '    </a>',
    '  </div>',
    '',
    '  <!-- Pied de la sidebar : CTA -->',
    '  <div class="nav-mobile__footer">',
    '    <a href="' + rootPath + 'kreditantrag.html" class="btn btn-accent">⚡ Jetzt Kredit beantragen</a>',
    '  </div>',
    '</nav>'
  ].join('\n');

  // -------------------------------------------------------
  // HTML DU FOOTER
  // -------------------------------------------------------
  var FOOTER_HTML = [
    '<footer class="site-footer" role="contentinfo">',
    '  <!-- Diaporama en fondu enchaîné (Effet N°2, global) — construit par js/bg-effects.js -->',
    '  <div id="footerCrossfadeBg" aria-hidden="true"></div>',
    '  <div class="footer-top">',
    '',
    '    <!-- Colonne : marque -->',
    '    <div class="footer-brand">',
    '      <a href="' + rootPath + 'index.html" class="site-logo">',
    '        <img src="' + logoPath + '" alt="Blitz Leihen" class="site-logo__img" width="160" height="50" loading="lazy">',
    '      </a>',
    '      <p class="footer-brand__desc">',
    '        Blitz Leihen ist Ihr vertrauenswürdiger Finanzpartner für Privat- und Immobilienkredite in Deutschland. Schnell, transparent und fair.',
    '      </p>',
    '      <div class="footer-badges">',
    '        <span class="footer-badge">🔒 SSL-verschlüsselt</span>',
    '        <span class="footer-badge">🇩🇪 In Deutschland ansässig</span>',
    '        <span class="footer-badge">⚡ 48h Auszahlung</span>',
    '      </div>',
    '    </div>',
    '',
    '    <!-- Colonne : Produkte -->',
    '    <div class="footer-col">',
    '      <h3 class="footer-col__title">Unsere Produkte</h3>',
    '      <ul class="footer-col__links">',
    '        <li><a href="' + rootPath + 'kreditantrag.html"          class="footer-col__link">⚡ Kreditantrag stellen</a></li>',
    '        <li><a href="' + rootPath + 'kredite.html#privatkredit"   class="footer-col__link">Privatkredit</a></li>',
    '        <li><a href="' + rootPath + 'immobilien.html"             class="footer-col__link">Immobilienkredit</a></li>',
    '        <li><a href="' + rootPath + 'kredite.html#autokredit"     class="footer-col__link">Autofinanzierung</a></li>',
    '        <li><a href="' + rootPath + 'kredite.html#renovierung"    class="footer-col__link">Renovierungskredit</a></li>',
    '        <li><a href="' + rootPath + 'kredite.html#hypothek"       class="footer-col__link">Hypothekenkredit</a></li>',
    '        <li><a href="' + rootPath + 'kredite.html#umschuldung"    class="footer-col__link">Umschuldung</a></li>',
    '        <li><a href="' + rootPath + 'simulation.html"             class="footer-col__link">🧮 Kreditrechner</a></li>',
    '        <li><a href="' + rootPath + 'zinssatz.html"               class="footer-col__link">📖 Wie wird Ihr Zinssatz berechnet?</a></li>',
    '      </ul>',
    '    </div>',
    '',
    '    <!-- Colonne : Unternehmen -->',
    '    <div class="footer-col">',
    '      <h3 class="footer-col__title">Unternehmen</h3>',
    '      <ul class="footer-col__links">',
    '        <li><a href="' + rootPath + 'ueber-uns.html"  class="footer-col__link">Über uns</a></li>',
    '        <li><a href="' + rootPath + 'ratgeber.html"   class="footer-col__link">Ratgeber</a></li>',
    '        <li><a href="' + rootPath + 'kontakt.html"    class="footer-col__link">Kontakt</a></li>',
    '        <li><a href="' + rootPath + 'ueber-uns.html#team" class="footer-col__link">Unser Team</a></li>',
    '        <li><a href="' + rootPath + 'ueber-uns.html#karriere" class="footer-col__link">Karriere</a></li>',
    '        <li><a href="' + rootPath + 'impressum.html"  class="footer-col__link">Impressum</a></li>',
    '      </ul>',
    '    </div>',
    '',
    '    <!-- Colonne : Rechtliches -->',
    '    <div class="footer-col">',
    '      <h3 class="footer-col__title">Rechtliches</h3>',
    '      <ul class="footer-col__links">',
    '        <li><a href="' + rootPath + 'datenschutz.html" class="footer-col__link">Datenschutzerklärung</a></li>',
    '        <li><a href="' + rootPath + 'agb.html"          class="footer-col__link">AGB</a></li>',
    '        <li><a href="' + rootPath + 'impressum.html"    class="footer-col__link">Impressum</a></li>',
    '        <li><a href="' + rootPath + 'kontakt.html"      class="footer-col__link">Widerruf</a></li>',
    '      </ul>',
    '      <!-- Infos contact rapides -->',
    '      <div style="margin-top: 1.5rem;">',
    '        <p style="font-size:0.8rem; color:rgba(255,255,255,0.45); line-height:1.8;">',
    '          ✉ <span style="font-family:var(--font-mono);">info@blitz-leihen.de</span><br>',
    '          📞 <span style="font-family:var(--font-mono);">+49 (0) 800 123 456 7</span><br>',
    '          Mo–Fr: 08:00–18:00 Uhr',
    '        </p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <hr class="footer-divider">',
    '',
    '  <div class="footer-bottom">',
    '    <p class="footer-bottom__copy">',
    '      &copy; 2025 Blitz Leihen GmbH. Alle Rechte vorbehalten. Kreditvermittlung unterliegt der BaFin-Regulierung.',
    '    </p>',
    '    <nav class="footer-bottom__links" aria-label="Rechtliche Links">',
    '      <a href="' + rootPath + 'impressum.html"   class="footer-bottom__link">Impressum</a>',
    '      <a href="' + rootPath + 'datenschutz.html" class="footer-bottom__link">Datenschutz</a>',
    '      <a href="' + rootPath + 'agb.html"          class="footer-bottom__link">AGB</a>',
    '    </nav>',
    '  </div>',
    '</footer>',
    '',
    '<!-- Bouton retour en haut de page -->',
    '<button id="backToTop" aria-label="Nach oben scrollen" title="Nach oben">↑</button>'
  ].join('\n');

  // -------------------------------------------------------
  // INJECTION DANS LE DOM
  // Injecte chaque bloc dans son placeholder respectif
  // -------------------------------------------------------
  function inject(placeholderId, html) {
    var el = document.getElementById(placeholderId);
    if (!el) return false;
    el.outerHTML = html; // Remplace le placeholder par le vrai HTML
    return true;
  }

  function init() {
    inject('pageLoaderPlaceholder',  LOADER_HTML);
    inject('siteHeaderPlaceholder',  HEADER_HTML);
    inject('siteFooterPlaceholder',  FOOTER_HTML);
  }

  // Exécution immédiate si le DOM est prêt, sinon attente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
