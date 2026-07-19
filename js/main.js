/**
 * BLITZ LEIHEN — Script principal
 *
 * Ce fichier est inclus sur toutes les pages.
 * Il gère les fonctionnalités communes :
 *   1. Animation d'entrée des éléments au scroll (Intersection Observer)
 *   2. Accordéons FAQ
 *   3. Compteur animé des statistiques
 *   4. Tooltips simples
 *   5. Scroll vers le haut (bouton flottant)
 *   6. Calculatrice de prêt simple
 */

(function() {
  'use strict';

  // -------------------------------------------------------
  // 1. ANIMATION D'ENTRÉE AU SCROLL (Intersection Observer)
  // Les éléments avec la classe .animate-on-scroll apparaissent
  // en douceur quand ils entrent dans la fenêtre.
  // -------------------------------------------------------
  function initScrollAnimations() {
    // Vérification du support (tous les navigateurs modernes)
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Une fois visible, on arrête d'observer cet élément
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,    // Déclenchement quand 12% de l'élément est visible
      rootMargin: '0px 0px -40px 0px'  // Décalage de 40px vers le bas
    });

    // Observation de tous les éléments animables
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      observer.observe(el);
    });
  }

  // -------------------------------------------------------
  // 2. ACCORDÉONS FAQ
  // Ouverture/fermeture d'éléments .accordion-item
  // Un seul item peut être ouvert à la fois.
  // -------------------------------------------------------
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        var item = trigger.closest('.accordion-item');
        if (!item) return;

        var isOpen = item.classList.contains('open');

        // Ferme tous les autres accordéons du même groupe
        var group = item.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-item.open').forEach(function(openItem) {
            if (openItem !== item) {
              openItem.classList.remove('open');
              openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            }
          });
        }

        // Bascule l'état de l'accordéon cliqué
        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });
  }

  // -------------------------------------------------------
  // 3. COMPTEUR ANIMÉ DES STATISTIQUES
  // Les éléments [data-count] s'animent de 0 vers leur valeur finale
  // dès qu'ils entrent dans la fenêtre.
  // -------------------------------------------------------
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    var counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    // Formatage allemand : séparateur de milliers "." et virgule décimale
    // (ex: 15000 → "15.000", 98.5 → "98,5") — cohérent avec formatEuro()
    // utilisé ailleurs sur le site (js/kreditrechner.js, etc.)
    // useGrouping=false pour les années (ex: 2015 doit rester "2015", pas "2.015")
    function formatNombreAllemand(n, decimals, useGrouping) {
      return n.toLocaleString('de-DE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: useGrouping
      });
    }

    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;

        var el          = entry.target;
        var target      = parseFloat(el.getAttribute('data-count'));
        var suffix      = el.getAttribute('data-suffix') || '';
        var prefix      = el.getAttribute('data-prefix') || '';
        var decimals    = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
        var useGrouping = el.getAttribute('data-no-grouping') !== 'true';
        var duration    = 1800; // Durée de l'animation en ms
        var start       = null;

        // Animation via requestAnimationFrame
        function animate(timestamp) {
          if (!start) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);

          // Fonction d'easing (ralentissement progressif)
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = target * eased;

          el.textContent = prefix + formatNombreAllemand(current, decimals, useGrouping) + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = prefix + formatNombreAllemand(target, decimals, useGrouping) + suffix;
          }
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      counterObserver.observe(counter);
    });
  }

  // -------------------------------------------------------
  // 4. BOUTON "REMONTER EN HAUT"
  // Un bouton flottant apparaît après 400px de scroll
  // -------------------------------------------------------
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    // Affichage/masquage selon la position de scroll
    window.addEventListener('scroll', function() {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    // Clic → remonte en douceur
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------
  // Met à jour le remplissage bleu du curseur (input type="range")
  // pour qu'il suive dynamiquement la position du bouton rond.
  // -------------------------------------------------------
  function updateRangeFill(range) {
    var min = parseFloat(range.min) || 0;
    var max = parseFloat(range.max) || 100;
    var val = parseFloat(range.value) || 0;
    var percent = ((val - min) / (max - min)) * 100;
    range.style.setProperty('--range-fill', percent + '%');
  }

  // -------------------------------------------------------
  // 5. CALCULATRICE DE PRÊT RAPIDE
  // Calcule la mensualité approximative selon le montant,
  // la durée et le taux d'intérêt.
  // Formule : M = P × [r(1+r)^n] / [(1+r)^n - 1]
  // -------------------------------------------------------
  function initLoanCalculator() {
    var calc = document.getElementById('loanCalculator');
    if (!calc) return;

    var amountInput   = calc.querySelector('#calcAmount');
    var durationInput = calc.querySelector('#calcDuration');
    var rateInput     = calc.querySelector('#calcRate');
    var resultEl      = calc.querySelector('#calcResult');
    var monthlyEl     = calc.querySelector('#calcMonthly');
    var totalEl       = calc.querySelector('#calcTotal');
    var interestEl    = calc.querySelector('#calcInterest');

    function calculate() {
      var amount   = parseFloat(amountInput ? amountInput.value : 0) || 0;
      var months   = parseInt(durationInput ? durationInput.value : 0) || 0;
      var rateYear = parseFloat(rateInput ? rateInput.value : 0) || 0;

      if (amount <= 0 || months <= 0 || rateYear <= 0) {
        if (resultEl) resultEl.style.display = 'none';
        return;
      }

      var r       = rateYear / 100 / 12;            // Taux mensuel
      var monthly = amount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
      var total   = monthly * months;
      var interest = total - amount;

      // Affichage des résultats
      if (monthlyEl)  monthlyEl.textContent  = formatEuro(monthly);
      if (totalEl)    totalEl.textContent     = formatEuro(total);
      if (interestEl) interestEl.textContent  = formatEuro(interest);
      if (resultEl)   resultEl.style.display  = 'block';
    }

    // Mise à jour en temps réel à chaque changement
   // Mise à jour des labels des sliders si présents
    calc.querySelectorAll('input[type="range"]').forEach(function(range) {
      var display = document.getElementById(range.id + 'Display');

      range.addEventListener('input', function() {
        var unit = range.getAttribute('data-unit') || '';
        if (display) display.textContent = range.value + unit;
        updateRangeFill(range); // AJOUT : suit la position du curseur
      });

      // Affichage initial
      var unit = range.getAttribute('data-unit') || '';
      if (display) display.textContent = range.value + unit;
      updateRangeFill(range); // AJOUT : bon remplissage dès le chargement
    });

    // Calcul initial avec les valeurs par défaut
    calculate();
  }

  // -------------------------------------------------------
  // 6. UTILITAIRE — Formatage en euros (allemand)
  // Exemple : 15234.5 → "15.234,50 €"
  // -------------------------------------------------------
  function formatEuro(value) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Expose la fonction pour usage dans d'autres scripts
  window.BlitzUtils = { formatEuro: formatEuro };

  // -------------------------------------------------------
  // 7. SÉLECTION VISUELLE DES OPTIONS RADIO STYLISÉES
  // Gère l'état .selected sur les .form-radio-option
  // -------------------------------------------------------
  function initRadioOptions() {
    document.querySelectorAll('.form-radio-option').forEach(function(option) {
      var radio = option.querySelector('input[type="radio"]');
      if (!radio) return;

      option.addEventListener('click', function() {
        // Retire .selected de tous les frères dans le groupe
        var groupName = radio.name;
        document.querySelectorAll('input[name="' + groupName + '"]').forEach(function(r) {
          var parent = r.closest('.form-radio-option');
          if (parent) parent.classList.remove('selected');
        });

        // Coche le radio et marque l'option
        radio.checked = true;
        option.classList.add('selected');
      });

      // Marque l'option déjà cochée au chargement
      if (radio.checked) option.classList.add('selected');
    });
  }

  // -------------------------------------------------------
  // 8. SMOOTH SCROLL SUR LES ANCRES
  // -------------------------------------------------------
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href').slice(1);
        var target   = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        var offset = 96; // Compense la hauteur du header fixe
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  // -------------------------------------------------------
  // INITIALISATION GLOBALE — Exécution au chargement du DOM
  // -------------------------------------------------------
  function onReady() {
    initScrollAnimations();
    initAccordions();
    initCounters();
    initBackToTop();
    initLoanCalculator();
    initRadioOptions();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
