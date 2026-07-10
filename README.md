# Blitz Leihen — Frontend

> Site financier professionnel multipage pour l'entreprise **Blitz Leihen GmbH**  
> Prêts rapides pour résidents allemands et citoyens allemands en Europe.

---

## 📁 Structure des fichiers

```
blitz-leihen-frontend/
│
├── 📄 index.html              → Page d'accueil (Startseite)
├── 📄 kredite.html            → Nos produits prêt (Kredite)
├── 📄 immobilien.html         → Financement immobilier
├── 📄 ueber-uns.html          → À propos (Über uns)
├── 📄 kontakt.html            → Contact & Formulaire de demande
├── 📄 impressum.html          → Mentions légales
├── 📄 datenschutz.html        → Politique de confidentialité (DSGVO)
├── 📄 agb.html                → Conditions générales (AGB)
│
├── 🖼️  blitz_leihen_logo.webp  → Logo officiel Blitz Leihen
│
├── 📂 admin/
│   ├── 📄 login.html          → Page de connexion admin
│   └── 📄 dashboard.html      → Tableau de bord administrateur
│
├── 📂 css/
│   ├── 🎨 global.css          → Variables, reset, typographie, utilitaires
│   ├── 🎨 navigation.css      → Header sticky, menu mobile sidebar
│   ├── 🎨 components.css      → Loader, Hero Slider, Footer, Cards, Formulaires
│   ├── 🎨 pages.css           → Styles spécifiques à chaque page
│   └── 🎨 admin.css           → Styles de l'espace administrateur
│
└── 📂 js/
    ├── ⚡ template.js          → Injection du header/footer sur chaque page
    ├── ⚡ loader.js            → Loader de transition entre les pages
    ├── ⚡ navigation.js        → Sticky header + menu hamburger mobile
    ├── ⚡ hero-slider.js       → Slider d'images Cloudinary
    ├── ⚡ main.js              → Animations, accordéons, compteurs, calculatrice
    └── ⚡ forms.js             → Formulaire multi-étapes de demande de prêt
```

---

## 🚀 Démarrage rapide

### Prérequis
Aucune dépendance ni installation requise. Le projet fonctionne avec un simple serveur de fichiers statiques.

### Option 1 — VS Code Live Server (recommandé)
1. Ouvrir le dossier dans VS Code
2. Installer l'extension **Live Server**
3. Clic droit sur `index.html` → "Open with Live Server"

### Option 2 — Python (intégré sur Mac/Linux)
```bash
cd blitz-leihen-frontend
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

### Option 3 — Node.js (si installé)
```bash
npx serve blitz-leihen-frontend
```

> ⚠️ **Important :** Ne pas ouvrir les fichiers HTML directement avec `file://` — certaines fonctionnalités JavaScript nécessitent un serveur HTTP.

---

## 🖼️ Configuration des images Cloudinary

Toutes les images du Hero Slider sont configurées dans un seul fichier :

```
js/hero-slider.js
```

### Étape 1 — Ouvrir `js/hero-slider.js`

Localiser la section `HERO_SLIDES` en haut du fichier :

```javascript
var HERO_SLIDES = [
  {
    image: 'LIEN_CLOUDINARY_IMAGE_1',   // ← Remplacer ici
    eyebrow: 'Ihr Finanzpartner...',
    title: 'Schnelle Kredite...',
    // ...
  },
  {
    image: 'LIEN_CLOUDINARY_IMAGE_2',   // ← Remplacer ici
    // ...
  },
  {
    image: 'LIEN_CLOUDINARY_IMAGE_3',   // ← Remplacer ici
    // ...
  }
];
```

### Étape 2 — Remplacer par vos URLs Cloudinary

```javascript
image: 'https://res.cloudinary.com/VOTRE_COMPTE/image/upload/v1234/image1.jpg',
```

### Étape 3 — Ajouter d'autres images (optionnel)

Dupliquer simplement un objet slide et remplir les champs.

### Autres emplacements d'images

Chaque emplacement d'image sur le site est marqué par un bloc :
```html
<div class="img-placeholder">
  <span class="img-placeholder__label">Image XXX à remplacer</span>
  <span class="img-placeholder__hint">Type: XXX | Taille recommandée: XXX</span>
</div>
```

Pour remplacer un placeholder par une vraie image Cloudinary :
```html
<!-- AVANT (placeholder) -->
<div class="img-placeholder" style="height:420px;">
  <span>🏠</span>
  <span>Image maison à remplacer</span>
</div>

<!-- APRÈS (image réelle) -->
<img
  src="https://res.cloudinary.com/VOTRE_COMPTE/image/upload/v1234/maison.jpg"
  alt="Maison financée par Blitz Leihen"
  style="width:100%; height:420px; object-fit:cover; border-radius:var(--radius-2xl);"
  loading="lazy"
>
```

---

## 🎨 Personnalisation du design

Toutes les couleurs, polices et espacements sont définis dans **un seul fichier** :

```
css/global.css → section ":root { ... }"
```

### Couleurs principales

```css
:root {
  --color-primary:  #0B2D59;  /* Bleu marine → modifier pour changer le thème */
  --color-accent:   #C8A84B;  /* Or chaud → modifier la couleur accent */
}
```

### Polices

Les polices viennent de **Google Fonts** (chargées automatiquement) :
- **Titres** : Playfair Display (serif, premium)
- **Corps** : Inter (sans-serif, lisible)

Pour changer les polices, modifier la ligne `@import` en haut de `css/global.css`.

---

## 📱 Responsive

Le site est entièrement responsive sur 3 breakpoints :

| Breakpoint | Écran | Comportement |
|-----------|-------|--------------|
| Desktop | > 1024px | Navigation horizontale, grilles multi-colonnes |
| Tablette | 768px–1024px | Navigation hamburger, grilles 2 colonnes |
| Mobile | < 768px | Navigation sidebar, grilles 1 colonne |

---

## 🔒 Espace Administrateur

### Accès
```
URL : /admin/login.html
```

### Fonctionnalités
- ✅ Connexion sécurisée avec JWT (token Backend)
- ✅ Tableau de bord avec statistiques en temps réel
- ✅ Liste de toutes les demandes avec filtres
- ✅ Recherche par nom ou numéro de référence
- ✅ Détail d'une demande (drawer latéral)
- ✅ Modification du statut (Neu / Analyse / Akzeptiert / Abgelehnt)
- ✅ Mode démonstration si le backend n'est pas connecté

### Mode démo (sans backend)
Le dashboard affiche automatiquement des données fictives si l'API backend n'est pas disponible. Cela permet de tester l'interface sans serveur.

---

## 📋 Formulaire de demande de prêt

Le formulaire multi-étapes est dans `kontakt.html` et géré par `js/forms.js`.

### Étapes
1. **Étape 1** — Informations personnelles (nom, date de naissance, adresse, revenus...)
2. **Étape 2** — Informations de financement (type de prêt, montant, durée, SMS)
3. **Étape 3** — Récapitulatif + consentements RGPD + soumission

### Configuration de l'URL API
Dans `js/forms.js`, modifier la variable :
```javascript
var API_URL = 'http://localhost:3000/api/demandes';
// → Remplacer par l'URL de votre backend en production
```

---

## 💻 Technologies utilisées

| Technologie | Usage |
|------------|-------|
| HTML5 | Structure sémantique, accessibilité |
| CSS3 | Design, animations, responsive (Grid, Flexbox, Variables CSS) |
| JavaScript Vanilla | Interactions, slider, formulaires, animations |
| Google Fonts | Polices Inter + Playfair Display |
| Cloudinary | Hébergement des images (configuration externe) |

**Aucun framework utilisé** (pas de React, Vue, Angular, Bootstrap, Tailwind).

---

## 🔧 Points de connexion Backend

Ces variables sont à mettre à jour pour connecter le backend :

| Fichier | Variable | URL par défaut |
|---------|----------|---------------|
| `js/forms.js` | `API_URL` | `http://localhost:3000/api/demandes` |
| `admin/login.html` | `AUTH_URL` | `http://localhost:3000/api/auth/login` |
| `admin/dashboard.html` | `API_BASE` | `http://localhost:3000/api` |

---

## 🌐 SEO

Chaque page contient :
- `<title>` unique et descriptif
- `<meta name="description">` optimisée
- `<meta name="keywords">` ciblées
- Structure sémantique : `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- Titres hiérarchiques : H1 unique par page, H2/H3 organisés
- Attributs `alt` sur toutes les images
- `aria-label` sur les éléments interactifs
- `rel="noopener"` sur tous les liens externes

---

## 📧 Système email

L'envoi d'emails automatiques est géré côté **backend** (voir README Backend).

Le frontend envoie les données du formulaire vers le backend qui :
1. Envoie un email de confirmation au client
2. Envoie une notification au conseiller
3. Enregistre la demande en base de données

---

## 📱 Système SMS

Le frontend collecte l'accord SMS de l'utilisateur via la question :

> *"Möchten Sie Ihre Telefonnummer verifizieren, um SMS-Benachrichtigungen zu erhalten?"*

La valeur (`ja` / `nein`) est transmise au backend dans le champ `sms_verification`.
L'intégration du fournisseur SMS (ex: Twilio) est gérée côté backend.

---

## ⚡ Performance

- Images en `lazy loading` (sauf image principale du hero)
- CSS chargé dans `<head>` (pas de FOUC)
- JS chargé en bas de page (non bloquant)
- Animations CSS uniquement (pas de librairies JS d'animation)
- Transitions optimisées avec `will-change` uniquement là où nécessaire
- Loader léger : CSS pur, aucune librairie externe

---

## 🛡️ Sécurité frontend

- Validation côté client sur tous les champs du formulaire
- Protection CSRF gérée côté backend (token inclus dans les headers)
- Liens externes avec `rel="noopener noreferrer"`
- Pages admin avec `<meta name="robots" content="noindex, nofollow">`
- Token JWT stocké en `sessionStorage` (pas en `localStorage`)

---

## 📞 Support

**Blitz Leihen GmbH**  
Unter den Linden 42 · 10117 Berlin  
📧 info@blitz-leihen.de  
📞 +49 (0) 800 123 456 7

---

*Frontend développé en HTML5/CSS3/JavaScript Vanilla — sans frameworks. Commentaires en français dans tout le code.*
