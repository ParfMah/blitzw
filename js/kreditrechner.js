/**
 * BLITZ LEIHEN — Kreditrechner (page simulation.html)
 *
 * Calcule en temps réel une estimation de mensualité à partir d'un
 * montant et d'une durée, sur la base d'un taux d'exemple représentatif
 * (5,9 % TAEG) — clairement présenté comme non contractuel, cohérent
 * avec la Schuldenquote du formulaire de demande et la page
 * zinssatz.html qui explique les facteurs réels du taux individuel.
 *
 * Formule d'amortissement standard :
 *   M = P × r × (1+r)^n / ((1+r)^n - 1)
 *   P = capital, r = taux mensuel, n = nombre de mensualités
 */

(function () {
  'use strict';

  var TAUX_EXEMPLE_ANNUEL = 0.049; // 4,9 % — aligné sur le taux d'exemple représentatif du site (règle des 2/3)
  var TAUX_MENSUEL = TAUX_EXEMPLE_ANNUEL / 12;

  var state = {
    betrag: 10000,
    laufzeit: 48,
  };

  // -------------------------------------------------------
  // FORMATAGE
  // -------------------------------------------------------
  function formatEuro(n) {
    return Math.round(n).toLocaleString('de-DE') + ' €';
  }

  function formatMonate(n) {
    var jahre = n / 12;
    if (Number.isInteger(jahre) && jahre >= 1) {
      return n + ' Monate (' + jahre + (jahre === 1 ? ' Jahr' : ' Jahre') + ')';
    }
    return n + ' Monate';
  }

  // -------------------------------------------------------
  // CALCUL DE LA MENSUALITÉ (amortissement standard)
  // -------------------------------------------------------
  function calculerRate(betrag, laufzeit) {
    if (TAUX_MENSUEL === 0) return betrag / laufzeit;
    var facteur = Math.pow(1 + TAUX_MENSUEL, laufzeit);
    return betrag * TAUX_MENSUEL * facteur / (facteur - 1);
  }

  // -------------------------------------------------------
  // MISE À JOUR DE L'AFFICHAGE
  // -------------------------------------------------------
  function update() {
    var rate = calculerRate(state.betrag, state.laufzeit);
    var gesamt = rate * state.laufzeit;
    var kosten = gesamt - state.betrag;

    var betragDisplay = document.getElementById('betragDisplay');
    var laufzeitDisplay = document.getElementById('laufzeitDisplay');
    var rateValue = document.getElementById('rateValue');
    var gesamtValue = document.getElementById('gesamtValue');
    var kostenValue = document.getElementById('kostenValue');
    var applyBtn = document.getElementById('applyBtn');

    if (betragDisplay) betragDisplay.textContent = formatEuro(state.betrag);
    if (laufzeitDisplay) laufzeitDisplay.textContent = formatMonate(state.laufzeit);
    if (rateValue) rateValue.textContent = Math.round(rate).toLocaleString('de-DE');
    if (gesamtValue) gesamtValue.textContent = formatEuro(gesamt);
    if (kostenValue) kostenValue.textContent = formatEuro(kosten);

    // Le CTA transmet le montant/durée choisis au formulaire de demande,
    // qui les pré-remplit automatiquement (voir js/forms.js)
    if (applyBtn) {
      applyBtn.href = 'kreditantrag.html?betrag=' + state.betrag + '&laufzeit=' + state.laufzeit;
    }
  }

  // -------------------------------------------------------
  // SYNCHRONISATION DES BOUTONS RAPIDES ("chips")
  // -------------------------------------------------------
  function majBoutonsActifs(groupe, valeur, dataAttr) {
    document.querySelectorAll(groupe).forEach(function (btn) {
      btn.classList.toggle('active', parseInt(btn.getAttribute(dataAttr), 10) === valeur);
    });
  }

  // -------------------------------------------------------
  // PRÉ-REMPLISSAGE DEPUIS L'URL (?betrag=X&laufzeit=Y)
  // Permet d'arriver directement avec des valeurs pré-choisies,
  // par ex. depuis un lien partagé ou une autre page du site.
  // -------------------------------------------------------
  function lireParametresURL() {
    var params = new URLSearchParams(window.location.search);
    var betragParam = parseInt(params.get('betrag'), 10);
    var laufzeitParam = parseInt(params.get('laufzeit'), 10);

    if (!isNaN(betragParam) && betragParam >= 1000 && betragParam <= 100000) {
      state.betrag = betragParam;
    }
    if (!isNaN(laufzeitParam) && laufzeitParam >= 6 && laufzeitParam <= 360) {
      state.laufzeit = laufzeitParam;
    }
  }

  // -------------------------------------------------------
  // INITIALISATION
  // -------------------------------------------------------
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

  function init() {
    var betragRange = document.getElementById('betragRange');
    var laufzeitRange = document.getElementById('laufzeitRange');
    if (!betragRange || !laufzeitRange) return; // page différente

    lireParametresURL();
    betragRange.value = state.betrag;
    laufzeitRange.value = state.laufzeit;
    updateRangeFill(betragRange);   // AJOUT : bon remplissage dès le chargement
    updateRangeFill(laufzeitRange); // AJOUT

    betragRange.addEventListener('input', function () {
      state.betrag = parseInt(betragRange.value, 10);
      majBoutonsActifs('[data-betrag]', state.betrag, 'data-betrag');
      updateRangeFill(betragRange); // AJOUT : suit le glissement à la souris/au doigt
      update();
    });

    laufzeitRange.addEventListener('input', function () {
      state.laufzeit = parseInt(laufzeitRange.value, 10);
      majBoutonsActifs('[data-laufzeit]', state.laufzeit, 'data-laufzeit');
      updateRangeFill(laufzeitRange); // AJOUT
      update();
    });

    document.querySelectorAll('[data-betrag]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.betrag = parseInt(btn.getAttribute('data-betrag'), 10);
        betragRange.value = state.betrag;
        majBoutonsActifs('[data-betrag]', state.betrag, 'data-betrag');
        updateRangeFill(betragRange); // AJOUT : les boutons "10 000 €" etc. ne déclenchent pas 'input'
        update();
      });
    });

    document.querySelectorAll('[data-laufzeit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.laufzeit = parseInt(btn.getAttribute('data-laufzeit'), 10);
        laufzeitRange.value = state.laufzeit;
        majBoutonsActifs('[data-laufzeit]', state.laufzeit, 'data-laufzeit');
        updateRangeFill(laufzeitRange); // AJOUT
        update();
      });
    });

    majBoutonsActifs('[data-betrag]', state.betrag, 'data-betrag');
    majBoutonsActifs('[data-laufzeit]', state.laufzeit, 'data-laufzeit');
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
