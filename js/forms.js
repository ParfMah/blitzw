/**
 * BLITZ LEIHEN — Gestion des formulaires
 *
 * Gère le formulaire de demande de prêt multi-étapes :
 *   - Navigation entre les étapes
 *   - Validation des champs en temps réel
 *   - Sélection des options radio stylisées
 *   - Soumission : génération du numéro de dossier + envoi des
 *     e-mails de confirmation/alerte via js/notifications.js
 *   - Tracking d'abandon : alerte le conseiller si le visiteur
 *     quitte la page après avoir renseigné son e-mail mais sans
 *     avoir terminé sa demande
 *   - Affichage des messages de succès / erreur
 *
 * Structure du formulaire :
 *   Étape 1 : Informations personnelles
 *   Étape 2 : Informations financières et type de prêt
 *   Étape 3 : Vérification et confirmation
 */

(function() {
  'use strict';

  // Clés sessionStorage pour le tracking d'abandon (une seule
  // alerte d'abandon par visite, jamais après une soumission réussie)
  var FLAG_COMPLETED = 'blitz_form_completed';
  var FLAG_ABANDON_SENT = 'blitz_abandon_sent';

  // -------------------------------------------------------
  // ÉTAT DU FORMULAIRE
  // Stocke toutes les données entre les étapes
  // -------------------------------------------------------
  var formState = {
    currentStep: 1,
    totalSteps: 3,
    data: {}
  };

  // -------------------------------------------------------
  // INITIALISATION
  // -------------------------------------------------------
  function init() {
    var form = document.getElementById('loanApplicationForm');
    if (!form) return;

    // Pré-remplissage depuis le Kreditrechner (simulation.html), qui
    // transmet le montant/durée choisis via ?betrag=X&laufzeit=Y
    preremplirDepuisURL();

    // Boutons navigation entre étapes
    var btnNext    = form.querySelectorAll('.btn-next-step');
    var btnPrev    = form.querySelectorAll('.btn-prev-step');

    btnNext.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var step = parseInt(btn.getAttribute('data-step'));
        if (validateStep(step)) {
          collectStepData(step);
          goToStep(step + 1);
        }
      });
    });

    btnPrev.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var step = parseInt(btn.getAttribute('data-step'));
        goToStep(step - 1);
      });
    });

    // Soumission finale
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      collectStepData(3);
      submitForm();
    });

    // Validation en temps réel des champs
    form.querySelectorAll('.form-control').forEach(function(input) {
      input.addEventListener('blur', function() { validateField(input); });
      input.addEventListener('input', function() {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    // Mise à jour du résumé à l'étape 3
    form.querySelectorAll('input, select, textarea').forEach(function(field) {
      field.addEventListener('change', updateSummary);
    });

    // Date de naissance : remplissage des listes Jour/Année +
    // reconstruction du champ caché à chaque changement
    populerGeburtsdatumSelects();
    ['geburtsdatumTag', 'geburtsdatumMonat', 'geburtsdatumJahr'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function() {
        ajusterJoursDisponibles();
        validateGeburtsdatumGroup();
      });
    });

    // Schuldenquote : recalcul en temps réel dès qu'un champ pertinent change
    ['einkommen', 'bestehendeVerbindlichkeiten', 'kreditbetrag', 'laufzeit'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', updateSchuldenquote);
      el.addEventListener('change', updateSchuldenquote);
    });

    // Initialisation de la première étape
    goToStep(1);

    // Couvre le cas d'un champ déjà rempli au chargement (pré-remplissage
    // depuis le Kreditrechner, autofill du navigateur, etc.)
    updateSchuldenquote();

    // Surveillance d'un éventuel abandon du formulaire
    trackAbandonment();
  }

  // -------------------------------------------------------
  // NAVIGATION ENTRE ÉTAPES
  // -------------------------------------------------------
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > formState.totalSteps) return;

    formState.currentStep = stepNumber;

    // Affiche/masque les panneaux d'étapes
    document.querySelectorAll('.form-step-panel').forEach(function(panel) {
      var panelStep = parseInt(panel.getAttribute('data-step'));
      panel.style.display = panelStep === stepNumber ? 'block' : 'none';
    });

    // Met à jour les indicateurs d'étapes dans l'en-tête
    document.querySelectorAll('.form-step').forEach(function(indicator) {
      var indicatorStep = parseInt(indicator.getAttribute('data-step'));
      indicator.classList.remove('active', 'completed');
      if (indicatorStep === stepNumber) indicator.classList.add('active');
      if (indicatorStep < stepNumber)  indicator.classList.add('completed');
    });

    // Scroll en haut du formulaire
    var formEl = document.getElementById('loanApplicationForm');
    if (formEl) {
      var offset = 100;
      var top = formEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    // Mise à jour du résumé à l'étape 3
    if (stepNumber === 3) updateSummary();
  }

  // -------------------------------------------------------
  // VALIDATION D'UNE ÉTAPE COMPLÈTE
  // Retourne true si tous les champs requis sont valides
  // -------------------------------------------------------
  function validateStep(step) {
    var panel = document.querySelector('.form-step-panel[data-step="' + step + '"]');
    if (!panel) return true;

    var isValid = true;
    var requiredFields = panel.querySelectorAll('[required]');

    requiredFields.forEach(function(field) {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      // Scroll vers la première erreur
      var firstError = panel.querySelector('.form-control.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  // -------------------------------------------------------
  // VALIDATION D'UN CHAMP INDIVIDUEL
  // -------------------------------------------------------
  function validateField(field) {
    var fieldName = field.name || field.id;

    // Cas spécial : date de naissance reconstruite depuis 3 <select>
    // (voir validateGeburtsdatumGroup, qui gère son propre affichage d'erreur)
    if (fieldName === 'geburtsdatum' && field.type === 'hidden') {
      return validateGeburtsdatumGroup();
    }

    var value = field.value.trim();
    var errorEl = field.parentNode.querySelector('.form-error');
    var errorMsg = '';

    // Vide mais requis
    if (field.hasAttribute('required') && !value) {
      errorMsg = 'Dieses Feld ist erforderlich.';
    }

    // Validation spécifique par type
    if (value && field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      }
    }

    if (value && field.type === 'tel') {
      if (!/^[\+]?[\d\s\-\(\)]{8,20}$/.test(value)) {
        errorMsg = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      }
    }

    // Affichage de l'erreur
    field.classList.toggle('error', errorMsg !== '');
    field.classList.toggle('valid', errorMsg === '' && value !== '');

    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.style.display = errorMsg ? 'flex' : 'none';
    }

    return errorMsg === '';
  }

  // -------------------------------------------------------
  // DATE DE NAISSANCE — 3 LISTES DÉROULANTES (jour / mois / année)
  // -------------------------------------------------------

  // Remplit dynamiquement les listes Jour et Année (le Mois est
  // déjà statique dans le HTML avec les noms des mois en allemand)
  function populerGeburtsdatumSelects() {
    var tagSelect  = document.getElementById('geburtsdatumTag');
    var jahrSelect = document.getElementById('geburtsdatumJahr');
    if (!tagSelect || !jahrSelect) return;

    for (var j = 1; j <= 31; j++) {
      var jOpt = document.createElement('option');
      var jVal = (j < 10 ? '0' : '') + j;
      jOpt.value = jVal;
      jOpt.textContent = jVal;
      tagSelect.appendChild(jOpt);
    }

    // De (année actuelle - 18) à (année actuelle - 100), ordre décroissant
    var currentYear = new Date().getFullYear();
    for (var y = currentYear - 18; y >= currentYear - 100; y--) {
      var yOpt = document.createElement('option');
      yOpt.value = String(y);
      yOpt.textContent = String(y);
      jahrSelect.appendChild(yOpt);
    }
  }

  // Ajuste le nombre de jours disponibles selon le mois/année choisi
  // (ex : masque le 30/31 pour février, gère les années bissextiles)
  function ajusterJoursDisponibles() {
    var tagSelect   = document.getElementById('geburtsdatumTag');
    var monatSelect = document.getElementById('geburtsdatumMonat');
    var jahrSelect  = document.getElementById('geburtsdatumJahr');
    if (!tagSelect || !monatSelect || !jahrSelect) return;

    var monat = parseInt(monatSelect.value, 10);
    var jahr  = parseInt(jahrSelect.value, 10) || new Date().getFullYear();
    var maxJours = 31;

    if (monat) {
      maxJours = new Date(jahr, monat, 0).getDate(); // dernier jour du mois choisi
    }

    var valeurActuelle = tagSelect.value;
    Array.prototype.forEach.call(tagSelect.options, function(opt) {
      if (!opt.value) return;
      opt.hidden = parseInt(opt.value, 10) > maxJours;
    });

    if (valeurActuelle && parseInt(valeurActuelle, 10) > maxJours) {
      tagSelect.value = '';
    }
  }

  // Valide le trio jour/mois/année, reconstruit la date ISO dans le
  // champ caché #geburtsdatum, et affiche le retour visuel adapté
  // Valide le trio jour/mois/année, reconstruit la date ISO dans le
  // champ caché #geburtsdatum, et affiche le retour visuel adapté
  function validateGeburtsdatumGroup() {
    var tag    = document.getElementById('geburtsdatumTag');
    var monat  = document.getElementById('geburtsdatumMonat');
    var jahr   = document.getElementById('geburtsdatumJahr');
    var hidden = document.getElementById('geburtsdatum');
    var errorEl = document.getElementById('geburtsdatumError');
    if (!tag || !monat || !jahr || !hidden) return true;

    var selects = [tag, monat, jahr];
    var alleAusgefuellt = tag.value && monat.value && jahr.value;

    // AJOUT : tant que les 3 champs ne sont pas tous remplis, on n'affiche
    // aucune erreur — ce n'est pas encore une erreur, juste une saisie en cours.
    if (!alleAusgefuellt) {
      hidden.value = '';
      selects.forEach(function(sel) {
        sel.classList.remove('error', 'valid');
      });
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      return false;
    }

    var errorMsg = '';
    var iso  = jahr.value + '-' + monat.value + '-' + tag.value;
    var date = new Date(iso + 'T00:00:00');

    if (isNaN(date.getTime()) || date.getDate() !== parseInt(tag.value, 10)) {
      errorMsg = 'Dieses Datum ist ungültig.';
      hidden.value = '';
    } else {
      var age = Math.floor((Date.now() - date.getTime()) / 31536000000);
      if (age < 18) {
        errorMsg = 'Sie müssen mindestens 18 Jahre alt sein.';
      } else if (age > 80) {
        errorMsg = 'Bitte überprüfen Sie das eingegebene Geburtsdatum.';
      }
      hidden.value = errorMsg ? '' : iso;
    }

    selects.forEach(function(sel) {
      sel.classList.toggle('error', errorMsg !== '');
      sel.classList.toggle('valid', errorMsg === '');
    });

    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.style.display = errorMsg ? 'flex' : 'none';
    }

    return errorMsg === '';
  }

  // -------------------------------------------------------
  // SCHULDENQUOTE — Taux d'endettement calculé automatiquement
  //
  // Formule : (dettes existantes + mensualité estimée du nouveau
  // crédit) / revenu net mensuel × 100
  // La mensualité du nouveau crédit est une estimation linéaire
  // SANS intérêts (montant ÷ durée) — le site ne connaissant pas
  // le taux réel qui sera proposé par un partenaire bancaire.
  // -------------------------------------------------------
  function updateSchuldenquote() {
    var einkommenEl         = document.getElementById('einkommen');
    var verbindlichkeitenEl = document.getElementById('bestehendeVerbindlichkeiten');
    var kreditbetragEl      = document.getElementById('kreditbetrag');
    var laufzeitEl          = document.getElementById('laufzeit');
    var box     = document.getElementById('schuldenquoteBox');
    var card    = document.getElementById('schuldenquoteCard');
    var valueEl = document.getElementById('schuldenquoteValue');
    var hintEl  = document.getElementById('schuldenquoteHint');
    if (!einkommenEl || !kreditbetragEl || !laufzeitEl || !box) return;

    var einkommen         = parseFloat(einkommenEl.value) || 0;
    var verbindlichkeiten = parseFloat(verbindlichkeitenEl && verbindlichkeitenEl.value) || 0;
    var kreditbetrag      = parseFloat(kreditbetragEl.value) || 0;
    var laufzeit          = parseFloat(laufzeitEl.value) || 0;

    if (einkommen <= 0 || kreditbetrag <= 0 || laufzeit <= 0) {
      box.style.display = 'none';
      return;
    }

    var geschaetzteRate = kreditbetrag / laufzeit;
    var quote = ((verbindlichkeiten + geschaetzteRate) / einkommen) * 100;
    quote = Math.round(quote * 10) / 10;

    box.style.display = 'block';
    if (valueEl) valueEl.textContent = quote.toLocaleString('de-DE') + ' %';

    if (card) card.classList.remove('tier-good', 'tier-medium', 'tier-high');
    var hint = '';
    if (quote < 35) {
      if (card) card.classList.add('tier-good');
      hint = '✓ Solide Quote — gute Voraussetzungen für die Prüfung Ihres Antrags.';
    } else if (quote < 45) {
      if (card) card.classList.add('tier-medium');
      hint = '⚠ Erhöhte Quote — kann die Prüfung verlangsamen, schließt eine Genehmigung aber nicht aus.';
    } else {
      if (card) card.classList.add('tier-high');
      hint = '⚠ Hohe Quote — die Genehmigung könnte erschwert sein. Ein Berater kann mögliche Lösungen besprechen.';
    }
    if (hintEl) hintEl.textContent = hint;
  }

  // -------------------------------------------------------
  // COLLECTE DES DONNÉES D'UNE ÉTAPE
  // -------------------------------------------------------
  function collectStepData(step) {
    var panel = document.querySelector('.form-step-panel[data-step="' + step + '"]');
    if (!panel) return;

    panel.querySelectorAll('input, select, textarea').forEach(function(field) {
      if (!field.name) return;

      // Cas spécial pour les radios
      if (field.type === 'radio') {
        if (field.checked) formState.data[field.name] = field.value;
        return;
      }

      // Cas spécial pour les checkboxes
      if (field.type === 'checkbox') {
        formState.data[field.name] = field.checked;
        return;
      }

      formState.data[field.name] = field.value.trim();
    });
  }

  // -------------------------------------------------------
  // MISE À JOUR DU RÉSUMÉ (étape 3)
  // Affiche un récapitulatif de toutes les données saisies
  // -------------------------------------------------------
  function updateSummary() {
    var summary = document.getElementById('formSummary');
    if (!summary) return;

    // Collecte des données des étapes précédentes
    collectStepData(1);
    collectStepData(2);

    var d = formState.data;

    // Formatage du montant en euros
    var amount = d.kreditbetrag ? Number(d.kreditbetrag).toLocaleString('de-DE') + ' €' : '—';

    // Schuldenquote estimée pour le résumé (même formule que updateSchuldenquote)
    var schuldenquoteResume = '—';
    var einkommenNum = parseFloat(d.einkommen) || 0;
    var kreditbetragNum = parseFloat(d.kreditbetrag) || 0;
    var laufzeitNum = parseFloat(d.laufzeit) || 0;
    if (einkommenNum > 0 && kreditbetragNum > 0 && laufzeitNum > 0) {
      var verbindlichkeitenNum = parseFloat(d.bestehendeVerbindlichkeiten) || 0;
      var quoteResume = ((verbindlichkeitenNum + (kreditbetragNum / laufzeitNum)) / einkommenNum) * 100;
      schuldenquoteResume = (Math.round(quoteResume * 10) / 10).toLocaleString('de-DE') + ' %';
    }

    summary.innerHTML = [
      '<div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4);">',

      // Informations personnelles
      '<div>',
      '<h4 style="font-size:var(--text-sm); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:var(--space-4);">Persönliche Angaben</h4>',
      summaryRow('Name',         (d.vorname || '') + ' ' + (d.nachname || '')),
      summaryRow('Geburtsdatum', formatGeburtsdatumAffichage(d.geburtsdatum)),
      summaryRow('E-Mail',       d.email || '—'),
      summaryRow('Telefon',      d.telefon || '—'),
      summaryRow('Wohnort',      (d.adresse || '') + (d.ort ? ', ' + d.ort : '')),
      summaryRow('Land',         d.land || '—'),
      summaryRow('Beschäftigung', d.beschaeftigung || '—'),
      summaryRow('Monatliches Nettoeinkommen', d.einkommen ? d.einkommen + ' €' : '—'),
      summaryRow('Bestehende Verbindlichkeiten', d.bestehendeVerbindlichkeiten ? d.bestehendeVerbindlichkeiten + ' €' : '0 €'),
      '</div>',

      // Informations prêt
      '<div>',
      '<h4 style="font-size:var(--text-sm); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:var(--space-4);">Kreditangaben</h4>',
      summaryRow('Kreditart',      d.kreditart || '—'),
      summaryRow('Kreditbetrag',   amount),
      summaryRow('Laufzeit',       d.laufzeit ? d.laufzeit + ' Monate' : '—'),
      summaryRow('Geschätzte Schuldenquote', schuldenquoteResume),
      summaryRow('Verwendungszweck', d.verwendungszweck || '—'),
      summaryRow('SMS-Benachrichtigung', d.sms_verification === 'ja' ? '✓ Ja, gewünscht' : '✗ Nein, nicht gewünscht'),
      '</div>',

      '</div>'
    ].join('');
  }

  // Formate une date ISO (YYYY-MM-DD) en format allemand DD.MM.YYYY pour l'affichage
  function formatGeburtsdatumAffichage(iso) {
    if (!iso || iso.indexOf('-') === -1) return '—';
    var parts = iso.split('-');
    if (parts.length !== 3) return '—';
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  // -------------------------------------------------------
  // PRÉ-REMPLISSAGE DEPUIS LE KREDITRECHNER
  // Lit ?betrag=X&laufzeit=Y dans l'URL (transmis par le bouton
  // "Jetzt beantragen" de simulation.html) et pré-remplit les champs
  // correspondants du formulaire, pour éviter à l'utilisateur de
  // ressaisir ce qu'il a déjà choisi dans le simulateur.
  // -------------------------------------------------------
  function preremplirDepuisURL() {
    var params = new URLSearchParams(window.location.search);
    var betrag   = parseInt(params.get('betrag'), 10);
    var laufzeit = parseInt(params.get('laufzeit'), 10);

    var betragEl   = document.getElementById('kreditbetrag');
    var laufzeitEl = document.getElementById('laufzeit');

    if (betragEl && !isNaN(betrag) && betrag >= 1000 && betrag <= 1500000) {
      betragEl.value = betrag;
    }

    if (laufzeitEl && !isNaN(laufzeit)) {
      // Ne sélectionne que si la durée correspond à une option existante
      var optionExiste = Array.prototype.some.call(laufzeitEl.options, function (opt) {
        return parseInt(opt.value, 10) === laufzeit;
      });
      if (optionExiste) laufzeitEl.value = String(laufzeit);
    }
  }

  // Crée une ligne de résumé HTML
  function summaryRow(label, value) {
    return [
      '<div style="margin-bottom:var(--space-3);">',
      '  <span style="font-size:var(--text-xs); color:var(--color-text-muted); display:block;">' + label + '</span>',
      '  <span style="font-size:var(--text-sm); font-weight:var(--weight-medium); color:var(--color-text);">' + (value || '—') + '</span>',
      '</div>'
    ].join('');
  }

  // -------------------------------------------------------
  // SOUMISSION DU FORMULAIRE
  //
  // Envoie la demande au backend Express (POST /api/demandes)
  // qui se charge de :
  //   - valider et persister en MongoDB
  //   - générer le vrai numéro de référence
  //   - envoyer l'email de confirmation au client (Nodemailer)
  //   - envoyer l'alerte au conseiller (Nodemailer)
  //   - déclencher le SMS si opt-in (Twilio)
  //
  // La localisation du visiteur (ville/pays par IP) est collectée
  // côté client et envoyée avec la demande pour enrichir le profil.
  // -------------------------------------------------------
  function submitForm() {
    var submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet…';
    }

    // Collecte finale de toutes les données du formulaire
    collectStepData(3);

    var apiBase = (window.BlitzNotify && window.BlitzNotify.getApiBase)
      ? window.BlitzNotify.getApiBase()
      : 'https://79-108-162-55.sslip.io';

    // Récupère la localisation puis soumet la demande
    var locationPromise = (window.BlitzNotify && window.BlitzNotify.getLocation)
      ? window.BlitzNotify.getLocation()
      : Promise.resolve(null);

    locationPromise.then(function (location) {
      // Enrichit les données avec la localisation du visiteur
      var payload = Object.assign({}, formState.data);
      if (location) {
        payload.visiteurVille                 = location.city    || '';
        payload.visiteurRegion                = location.region  || '';
        payload.visiteurPays                  = location.country || '';
        payload.visiteurLocalisationAffichage = location.display || '';
      }

      return fetch(apiBase + '/api/demandes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    })
    .then(function (response) {
      return response.json().then(function (data) {
        return { ok: response.ok, status: response.status, data: data };
      });
    })
    .then(function (result) {
      if (result.ok && result.data.success) {
        // Succès : le backend a tout géré (base de données + emails + SMS)
        // On utilise le numéro de référence du backend, pas un généré localement
        sessionStorage.setItem(FLAG_COMPLETED, '1');
        showSuccess(result.data.data || result.data);
      } else {
        // Erreur de validation ou erreur serveur
        console.error('[Blitz Leihen] Erreur soumission:', result.data);
        showError();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Antrag absenden';
        }
      }
    })
    .catch(function (err) {
      console.error('[Blitz Leihen] Erreur réseau lors de la soumission:', err);
      showError();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Antrag absenden';
      }
    });
  }

  // -------------------------------------------------------
  // TRACKING D'ABANDON
  //
  // Si le visiteur a renseigné son email mais quitte la page
  // sans terminer, le conseiller reçoit une alerte via le
  // backend (POST /api/demandes/abandon).
  //
  // "visibilitychange" est utilisé plutôt que "beforeunload"
  // car plus fiable sur mobile et la requête n'est pas annulée
  // lors d'une vraie fermeture de page (voir sendAbandonment
  // dans notifications.js qui utilise sendBeacon + keepalive).
  // -------------------------------------------------------
  function trackAbandonment() {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'hidden') return;

      // Demande déjà complétée ou alerte déjà envoyée cette session
      if (sessionStorage.getItem(FLAG_COMPLETED))    return;
      if (sessionStorage.getItem(FLAG_ABANDON_SENT)) return;

      // Capture les données de toutes les étapes déjà visitées
      collectStepData(1);
      collectStepData(2);
      collectStepData(3);

      var hasEmail = formState.data.email && formState.data.email.indexOf('@') > -1;
      if (!hasEmail) return; // Pas assez d'info pour recontacter le visiteur

      sessionStorage.setItem(FLAG_ABANDON_SENT, '1');

      if (!window.BlitzNotify || !window.BlitzNotify.sendAbandonment) return;

      // Ajoute l'étape courante aux données envoyées
      var abandonData = Object.assign({}, formState.data, {
        etape: formState.currentStep,
      });

      // Récupère la localisation (peut être en cache) puis envoie
      window.BlitzNotify.getLocation()
        .then(function (location) {
          window.BlitzNotify.sendAbandonment(abandonData, location);
        })
        .catch(function () {
          window.BlitzNotify.sendAbandonment(abandonData, null);
        });
    });
  }

  // -------------------------------------------------------
  // AFFICHAGE DU SUCCÈS
  // -------------------------------------------------------
  function showSuccess(data) {
    var formEl    = document.getElementById('loanApplicationForm');
    var successEl = document.getElementById('formSuccess');

    if (formEl) formEl.style.display = 'none';

    if (successEl) {
      successEl.style.display = 'block';

      // Le backend peut renvoyer le numéro de référence à différents niveaux
      // selon l'évolution de l'API — on les cherche tous par ordre de priorité :
      //   data.referenceNumber            → format normalisé pour le frontend
      //   data.numeroReference            → champ du modèle Mongoose
      //   data.demande.numeroReference    → si wrappé dans { demande: {...} }
      var ref =
        (data && data.referenceNumber)                      ||
        (data && data.numeroReference)                      ||
        (data && data.demande && data.demande.numeroReference) ||
        null;

      var refEl = successEl.querySelector('.ref-number');
      if (refEl) {
        refEl.textContent = ref || 'BL-' + new Date().getFullYear() + '-' +
          Math.floor(100000 + Math.random() * 900000);
      }

      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // -------------------------------------------------------
  // AFFICHAGE DE L'ERREUR
  // -------------------------------------------------------
  function showError() {
    var errorEl = document.getElementById('formError');
    if (errorEl) {
      errorEl.style.display = 'flex';
      setTimeout(function() { errorEl.style.display = 'none'; }, 8000);
    }
  }

  // Lancement de l'initialisation au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
