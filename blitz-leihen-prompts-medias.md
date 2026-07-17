# Prompts médias — Blitz Leihen (refonte visuelle)

Ce document donne, pour **chaque placeholder** présent dans `js/bg-effects.js`,
un prompt prêt à coller dans un générateur d'images IA (Midjourney, DALL·E 3,
Adobe Firefly…), un nom de fichier optimisé SEO à utiliser **avant l'envoi sur
Cloudinary**, et des mots-clés de secours pour une banque d'images (Unsplash,
Pexels, Shutterstock, Adobe Stock).

**Identité visuelle commune à respecter** dans toutes les générations :
- Tons dominants : bleu marine profond (#0B2D59), bleu acier (#1A4A8A), touches dorées/ambrées (#D9A441)
- Ambiance : confiance, sérénité, modernité — jamais criarde ni "stock photo" trop artificielle
- Lumière naturelle, douce, légèrement chaude
- Cadrage cinématique, profondeur de champ marquée (arrière-plan légèrement flou)
- Aucun texte, logo ou watermark incrusté dans l'image
- Photoréaliste (pas d'illustration, pas de rendu 3D stylisé)

## ⚠️ Pourquoi le nom de fichier compte pour le SEO
Google (Images comme Web) lit le nom de fichier comme un signal de contexte,
au même titre que le texte alternatif (`alt`) et le texte autour de l'image.
Un fichier nommé `IMG_2481.jpg` n'apporte aucune information ; un fichier
nommé `immobilienfinanzierung-traumhaus.jpg` renforce la pertinence de la
page pour ce mot-clé, en particulier sur la recherche d'images.

**Règle à suivre pour chaque fichier avant l'envoi :**
- tout en minuscules
- mots séparés par des tirets `-` (jamais d'espace, jamais de `_`)
- descriptif et en allemand (langue du site), pas de suite de chiffres
- pas de mot générique seul (`bild.jpg`, `foto1.jpg`)

**Astuce Cloudinary :** au moment de l'upload, désactivez l'option
*"Unique filename"* (ou décochez-la dans les paramètres de l'upload preset).
Sinon Cloudinary ajoute un suffixe aléatoire au nom de fichier (ex.
`immobilienfinanzierung-traumhaus_ab3f9c`), ce qui casse la lisibilité de
l'URL finale. Avec l'option désactivée, l'URL Cloudinary reprend exactement
le nom de fichier que vous avez choisi.

Une fois les 19 images générées, nommées et envoyées sur Cloudinary,
donnez-moi simplement la liste des URLs (avec, pour chacune, à quel nom de
fichier / identifiant elle correspond) — je les placerai exactement au bon
endroit dans `js/bg-effects.js`.

---

## Effet 1 — Diaporama Ken Burns (Hero de la page d'accueil)
**Format : 1920×1080px (16:9), paysage**

### IMG_KENBURNS_HERO_1
**Nom de fichier recommandé :** `familie-finanzberatung-zuhause.jpg`
**Prompt :**
> Photorealistic warm lifestyle photo, a smiling couple in their early 30s sitting at a wooden kitchen table reviewing paperwork and a laptop together, soft afternoon window light, cozy modern German apartment interior, shallow depth of field, warm navy and amber color grading, candid and relaxed mood, shot on 50mm lens, no text or logos — 16:9

**Mots-clés banque d'images :** couple finances discussion table maison, family financial planning home, german couple laptop paperwork

### IMG_KENBURNS_HERO_2
**Nom de fichier recommandé :** `deutsche-stadtsilhouette-daemmerung.jpg`
**Prompt :**
> Photorealistic modern German city skyline at dusk, glass office towers reflecting deep navy blue and warm golden sunset light, wide cinematic aerial angle, calm and prosperous atmosphere, light haze, no visible text or logos on buildings — 16:9

**Mots-clés banque d'images :** frankfurt skyline dusk, german city skyline evening, modern european skyline sunset

### IMG_KENBURNS_HERO_3
**Nom de fichier recommandé :** `kreditberater-kundengespraech-buero.jpg`
**Prompt :**
> Photorealistic financial advisor in a tailored navy suit shaking hands with a happy client across a modern office desk, bright airy office with large windows, soft natural daylight, warm and trustworthy mood, shallow depth of field, candid documentary style, no text or logos — 16:9

**Mots-clés banque d'images :** financial advisor client handshake office, bank consultant meeting client, advisor smiling client office

### IMG_KENBURNS_HERO_4
**Nom de fichier recommandé :** `einfamilienhaus-mit-garten-deutschland.jpg`
**Prompt :**
> Photorealistic charming detached single-family house in Germany with a well-kept front garden, soft late-afternoon golden light, quiet suburban street, warm inviting atmosphere, slightly desaturated cinematic color grade with navy and amber tones, no people, no text or logos — 16:9

**Mots-clés banque d'images :** german suburban house garden, einfamilienhaus germany, cozy family house exterior golden hour

### IMG_KENBURNS_HERO_5
**Nom de fichier recommandé :** `digitaler-kreditantrag-smartphone.jpg`
**Prompt :**
> Photorealistic close-up of hands holding a smartphone showing a clean loan-application interface, a laptop blurred in the background on a wooden desk, soft window light, navy and gold color accents, modern minimalist fintech mood, shallow depth of field, no visible readable text on screen, no logos — 16:9

**Mots-clés banque d'images :** smartphone banking app hands, fintech mobile app desk laptop, digital loan application phone

---

## Effet 2a — Crossfade pur (Footer global, toutes les pages)
**Format : 1600×900px (16:9), tons plus sombres (l'overlay du footer est très foncé)**

### IMG_FOOTER_CROSSFADE_1
**Nom de fichier recommandé :** `buerogebaeude-nachtansicht-blitz-leihen.jpg`
**Prompt :**
> Photorealistic minimalist office building facade at night, softly illuminated windows, deep navy blue sky, long exposure calm mood, understated and elegant, no visible signage or logos, no text — 16:9

**Mots-clés banque d'images :** office building night facade, modern building illuminated windows night

### IMG_FOOTER_CROSSFADE_2
**Nom de fichier recommandé :** `team-finanzberater-buero-abend.jpg`
**Prompt :**
> Photorealistic small team of financial advisors working together around a table with laptops in a modern office, dim warm ambient lighting, shallow depth of field, muted navy tones, candid documentary mood, no readable text or logos — 16:9

**Mots-clés banque d'images :** finance team working office evening, business team meeting laptops dim light

### IMG_FOOTER_CROSSFADE_3
**Nom de fichier recommandé :** `abstraktes-finanznetzwerk-blau.jpg`
**Prompt :**
> Abstract dark navy blue background with subtle glowing interconnected light lines and nodes suggesting a financial or digital network, soft depth, elegant and minimal, no text, no logos, wallpaper-style composition — 16:9

**Mots-clés banque d'images :** abstract network dark blue, digital finance network abstract, dark blue technology network background

### IMG_FOOTER_CROSSFADE_4
**Nom de fichier recommandé :** `deutsche-grossstadt-nachtansicht.jpg`
**Prompt :**
> Photorealistic aerial night view of a German city (Berlin-style architecture) with illuminated streets and buildings, deep blue hour sky, calm and majestic mood, cinematic wide shot, no readable text or logos — 16:9

**Mots-clés banque d'images :** berlin night aerial view, german city night lights aerial

---

## Effet 2b — Crossfade pur (section Témoignages, page d'accueil)
**Format : 1600×900px (16:9), tons clairs et chauds (overlay clair, texte sombre par-dessus)**

### IMG_TESTIMONIALS_CROSSFADE_1
**Nom de fichier recommandé :** `zufriedener-kunde-portraet-blitz-leihen.jpg`
**Prompt :**
> Photorealistic candid portrait of a happy smiling customer in their 40s in a bright naturally-lit room, warm soft tones, genuine joyful expression, lifestyle photography style, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** happy customer portrait bright, smiling person natural light lifestyle

### IMG_TESTIMONIALS_CROSSFADE_2
**Nom de fichier recommandé :** `familie-vor-eigenheim-finanziert.jpg`
**Prompt :**
> Photorealistic family of four standing proudly in front of their newly purchased house, warm golden hour light, joyful candid moment, soft warm color grading, no text or logos — 16:9

**Mots-clés banque d'images :** family in front of new house happy, family house purchase golden hour

### IMG_TESTIMONIALS_CROSSFADE_3
**Nom de fichier recommandé :** `paar-finanzplanung-laptop-wohnzimmer.jpg`
**Prompt :**
> Photorealistic couple in their 30s sitting together on a sofa looking at a laptop, bright and airy modern living room, soft natural daylight, warm and relaxed mood, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** couple laptop sofa planning finances, couple living room laptop bright

---

## Effet 3 — Galerie à distorsion fluide (page kredite.html)
**Format : 1600×900px (16:9) — une image par produit de crédit**

### IMG_DISTORT_PRIVATKREDIT
**Nom de fichier recommandé :** `privatkredit-blitz-leihen.jpg`
**Prompt :**
> Photorealistic joyful young woman on a scenic trip (mountains or coastal road in background), candid travel lifestyle photo, warm natural light, representing a personal project made possible, soft cinematic color grade, no text or logos — 16:9

**Mots-clés banque d'images :** happy traveler personal project, lifestyle travel joy young woman

### IMG_DISTORT_IMMOBILIEN
**Nom de fichier recommandé :** `immobilienfinanzierung-traumhaus.jpg`
**Prompt :**
> Photorealistic modern elegant single-family house exterior with large windows and a landscaped garden, soft late afternoon light, aspirational "dream home" mood, no people, no text or logos — 16:9

**Mots-clés banque d'images :** modern dream house exterior, elegant family home architecture

### IMG_DISTORT_AUTOKREDIT
**Nom de fichier recommandé :** `autokredit-neuwagen-finanzierung.jpg`
**Prompt :**
> Photorealistic new car in a bright modern car dealership showroom, clean reflective floor, soft studio-like lighting with warm accents, aspirational mood, no visible brand logos, no text — 16:9

**Mots-clés banque d'images :** new car showroom dealership, modern car dealership interior

### IMG_DISTORT_RENOVIERUNG
**Nom de fichier recommandé :** `renovierungskredit-modernisierung-kueche.jpg`
**Prompt :**
> Photorealistic craftsman renovating a bright modern kitchen interior, natural construction materials, warm daylight through windows, sense of positive transformation, candid documentary style, no text or logos — 16:9

**Mots-clés banque d'images :** home renovation craftsman kitchen, modern renovation interior work

### IMG_DISTORT_HYPOTHEK
**Nom de fichier recommandé :** `hypothekenkredit-immobiliensicherheit.jpg`
**Prompt :**
> Photorealistic elegant large family property exterior with mature trees and manicured lawn, golden hour lighting, sense of legacy and stability, cinematic wide shot, no people, no text or logos — 16:9

**Mots-clés banque d'images :** large estate property golden hour, elegant property exterior wealth

### IMG_DISTORT_UMSCHULDUNG
**Nom de fichier recommandé :** `umschuldung-kredit-zusammenfassen.jpg`
**Prompt :**
> Photorealistic calm relaxed person in their 40s reviewing finances at a home desk with a cup of coffee, serene relieved expression, soft warm natural light, sense of relief and simplicity, no text or logos — 16:9

**Mots-clés banque d'images :** person relieved finances desk calm, serene financial planning home office

---

## Effet 4 — Photo de fond (Hero de kontakt.html)
**Format : 1920×1080px (16:9)** — remplace la vidéo initialement prévue : rendu
plus fiable, chargement plus léger, et un léger zoom continu (même animation
que l'effet Ken Burns) donne tout de même du mouvement à l'image.

### IMG_KONTAKT_HERO_BG
**Nom de fichier recommandé :** `kontakt-team-buero-blitz-leihen.jpg`
**Prompt :**
> Photorealistic bright modern office interior with a small team of financial advisors mid-conversation around a table, soft natural daylight, warm navy and gold tones, candid and welcoming mood, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** office team meeting warm light, financial advisors office bright, welcoming office team photo

---

## Récapitulatif — 19 images à produire

| # | Identifiant | Nom de fichier recommandé | Effet | Format |
|---|---|---|---|---|
| 1 | IMG_KENBURNS_HERO_1 | familie-finanzberatung-zuhause.jpg | Ken Burns (accueil) | 1920×1080 |
| 2 | IMG_KENBURNS_HERO_2 | deutsche-stadtsilhouette-daemmerung.jpg | Ken Burns (accueil) | 1920×1080 |
| 3 | IMG_KENBURNS_HERO_3 | kreditberater-kundengespraech-buero.jpg | Ken Burns (accueil) | 1920×1080 |
| 4 | IMG_KENBURNS_HERO_4 | einfamilienhaus-mit-garten-deutschland.jpg | Ken Burns (accueil) | 1920×1080 |
| 5 | IMG_KENBURNS_HERO_5 | digitaler-kreditantrag-smartphone.jpg | Ken Burns (accueil) | 1920×1080 |
| 6 | IMG_FOOTER_CROSSFADE_1 | buerogebaeude-nachtansicht-blitz-leihen.jpg | Crossfade footer | 1600×900 |
| 7 | IMG_FOOTER_CROSSFADE_2 | team-finanzberater-buero-abend.jpg | Crossfade footer | 1600×900 |
| 8 | IMG_FOOTER_CROSSFADE_3 | abstraktes-finanznetzwerk-blau.jpg | Crossfade footer | 1600×900 |
| 9 | IMG_FOOTER_CROSSFADE_4 | deutsche-grossstadt-nachtansicht.jpg | Crossfade footer | 1600×900 |
| 10 | IMG_TESTIMONIALS_CROSSFADE_1 | zufriedener-kunde-portraet-blitz-leihen.jpg | Crossfade témoignages | 1600×900 |
| 11 | IMG_TESTIMONIALS_CROSSFADE_2 | familie-vor-eigenheim-finanziert.jpg | Crossfade témoignages | 1600×900 |
| 12 | IMG_TESTIMONIALS_CROSSFADE_3 | paar-finanzplanung-laptop-wohnzimmer.jpg | Crossfade témoignages | 1600×900 |
| 13 | IMG_DISTORT_PRIVATKREDIT | privatkredit-blitz-leihen.jpg | Galerie distorsion | 1600×900 |
| 14 | IMG_DISTORT_IMMOBILIEN | immobilienfinanzierung-traumhaus.jpg | Galerie distorsion | 1600×900 |
| 15 | IMG_DISTORT_AUTOKREDIT | autokredit-neuwagen-finanzierung.jpg | Galerie distorsion | 1600×900 |
| 16 | IMG_DISTORT_RENOVIERUNG | renovierungskredit-modernisierung-kueche.jpg | Galerie distorsion | 1600×900 |
| 17 | IMG_DISTORT_HYPOTHEK | hypothekenkredit-immobiliensicherheit.jpg | Galerie distorsion | 1600×900 |
| 18 | IMG_DISTORT_UMSCHULDUNG | umschuldung-kredit-zusammenfassen.jpg | Galerie distorsion | 1600×900 |
| 19 | IMG_KONTAKT_HERO_BG | kontakt-team-buero-blitz-leihen.jpg | Photo hero contact | 1920×1080 |

---

## Effet 4bis — Photo de fond pour le hero de toutes les autres pages
**Format : 1920×1080px (16:9)** — même traitement que le hero de `kontakt.html` :
photo + léger zoom continu + overlay sombre `rgba(0,0,0,0.5)` pour la lisibilité.

### IMG_HERO_KREDITE — hero de `kredite.html`
**Nom de fichier recommandé :** `kredite-uebersicht-blitz-leihen.webp`
**Prompt :**
> Photorealistic warm handshake moment between a financial advisor and a client across a modern office desk, a tablet with a loan approval screen blurred in the foreground, soft natural daylight, navy and gold tones, trustworthy and professional mood, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** loan approval handshake office, bank advisor client agreement

### IMG_HERO_IMMOBILIEN — hero de `immobilien.html`
**Nom de fichier recommandé :** `immobilienfinanzierung-hero-schluesseluebergabe.webp`
**Prompt :**
> Photorealistic joyful moment of a real estate agent handing house keys to a happy young couple in front of a modern home, warm golden hour light, candid emotional mood, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** house keys handover couple, new homeowners key handoff

### IMG_HERO_SIMULATION — hero de `simulation.html`
**Nom de fichier recommandé :** `kreditrechner-finanzplanung-hero.webp`
**Prompt :**
> Photorealistic close-up of hands typing on a laptop showing a clean financial chart/graph interface, notebook and coffee cup nearby on a wooden desk, soft window light, navy and gold accents, focused planning mood, shallow depth of field, no readable text or logos — 16:9

**Mots-clés banque d'images :** laptop financial chart hands, budget planning laptop desk

### IMG_HERO_ZINSSATZ — hero de `zinssatz.html`
**Nom de fichier recommandé :** `zinssatz-beratung-hero.webp`
**Prompt :**
> Photorealistic financial advisor pointing at an interest rate chart on a tablet while explaining it to an attentive client, bright modern office, soft daylight, warm and clear communication mood, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** advisor explaining chart client, interest rate consultation office

### IMG_HERO_RATGEBER — hero de `ratgeber.html`
**Nom de fichier recommandé :** `ratgeber-finanzwissen-hero.webp`
**Prompt :**
> Photorealistic person sitting comfortably with a laptop and an open notebook, warm reading light, calm studious atmosphere, cozy home office, soft navy and amber color grade, no text or logos — 16:9

**Mots-clés banque d'images :** person researching laptop notebook, reading finance articles laptop cozy

### IMG_HERO_KREDITANTRAG — hero de `kreditantrag.html`
**Nom de fichier recommandé :** `kreditantrag-online-unterschrift-hero.webp`
**Prompt :**
> Photorealistic close-up of a hand signing a digital contract on a tablet with a stylus, clean modern desk setup, soft natural light, navy and gold tones, confident and modern fintech mood, shallow depth of field, no readable text or logos — 16:9

**Mots-clés banque d'images :** digital signature tablet hand, e-signature contract close-up

### IMG_HERO_AGB — hero de `agb.html`
**Nom de fichier recommandé :** `agb-vertragsunterlagen-hero.webp`
**Prompt :**
> Photorealistic neutral professional still life of contract documents, a pen, and reading glasses on a clean wooden desk, soft diffused daylight, calm formal mood, muted navy tones, no readable text or logos — 16:9

**Mots-clés banque d'images :** contract documents desk pen, legal paperwork office still life

### IMG_HERO_DATENSCHUTZ — hero de `datenschutz.html`
**Nom de fichier recommandé :** `datenschutz-datensicherheit-hero.webp`
**Prompt :**
> Photorealistic laptop on a clean desk displaying a subtle abstract padlock/shield icon glow on screen, soft blue ambient lighting, modern minimalist data-security mood, shallow depth of field, no readable text or logos — 16:9

**Mots-clés banque d'images :** data security laptop lock concept, cybersecurity office desk blue

### IMG_HERO_IMPRESSUM — hero de `impressum.html`
**Nom de fichier recommandé :** `impressum-buero-blitz-leihen-hero.webp`
**Prompt :**
> Photorealistic elegant modern office building reception/lobby area, clean architectural lines, soft daylight through large windows, professional and understated mood, no visible signage or logos, no text — 16:9

**Mots-clés banque d'images :** modern office lobby reception, corporate building interior clean

### IMG_HERO_SCHUFA_NEGATIV — hero de l'article `kredit-trotz-negativer-schufa.html`
**Nom de fichier recommandé :** `kredit-trotz-schufa-hero.webp`
**Prompt :**
> Photorealistic relieved, optimistic person looking out of a bright window with soft morning light, symbolic fresh-start mood, warm and hopeful atmosphere, shallow depth of field, no text or logos — 16:9

**Mots-clés banque d'images :** hopeful fresh start person window, relieved optimistic morning light

### IMG_HERO_KREDITANTRAG_ABLAUF — hero de l'article `kreditantrag-ablauf-dauer.html`
**Nom de fichier recommandé :** `kreditantrag-ablauf-prozess-hero.webp`
**Prompt :**
> Photorealistic person checking off steps on a digital checklist on a smartphone, tidy desk in the background, soft natural light, organized and efficient mood, shallow depth of field, no readable text or logos — 16:9

**Mots-clés banque d'images :** checklist smartphone process steps, digital process tracking phone

### IMG_HERO_RATENKREDIT_DISPO — hero de l'article `ratenkredit-vs-dispokredit.html`
**Nom de fichier recommandé :** `ratenkredit-dispokredit-vergleich-hero.webp`
**Prompt :**
> Photorealistic thoughtful person comparing two documents side by side at a bright desk, contemplative decision-making mood, soft daylight, navy and gold tones, shallow depth of field, no readable text or logos — 16:9

**Mots-clés banque d'images :** person comparing options desk, decision making documents thoughtful

### IMG_HERO_SCHUFA_SCORE — hero de l'article `schufa-score-verbessern.html`
**Nom de fichier recommandé :** `schufa-score-verbessern-hero.webp`
**Prompt :**
> Photorealistic abstract upward-trending growth chart glowing softly on a tablet screen held by a person, symbolic positive financial improvement, warm confident mood, soft light, shallow depth of field, no readable text or logos — 16:9

**Mots-clés banque d'images :** upward growth chart tablet, positive financial trend graph hand

### IMG_HERO_UEBER_UNS — hero "Über uns" de `ueber-uns.html`
**Nom de fichier recommandé :** `ueber-uns-team-blitz-leihen-hero.webp`
**Prompt :**
> Photorealistic candid team photo of a diverse group of financial advisors smiling together in a modern bright office, warm natural light, genuine camaraderie, navy and gold color accents, no text or logos — 16:9

**Mots-clés banque d'images :** finance team office group photo, diverse professional team candid

---

## Récapitulatif — 14 images de hero supplémentaires

| # | Identifiant | Nom de fichier recommandé | Page |
|---|---|---|---|
| 1 | IMG_HERO_KREDITE | kredite-uebersicht-blitz-leihen.webp | kredite.html |
| 2 | IMG_HERO_IMMOBILIEN | immobilienfinanzierung-hero-schluesseluebergabe.webp | immobilien.html |
| 3 | IMG_HERO_SIMULATION | kreditrechner-finanzplanung-hero.webp | simulation.html |
| 4 | IMG_HERO_ZINSSATZ | zinssatz-beratung-hero.webp | zinssatz.html |
| 5 | IMG_HERO_RATGEBER | ratgeber-finanzwissen-hero.webp | ratgeber.html |
| 6 | IMG_HERO_KREDITANTRAG | kreditantrag-online-unterschrift-hero.webp | kreditantrag.html |
| 7 | IMG_HERO_AGB | agb-vertragsunterlagen-hero.webp | agb.html |
| 8 | IMG_HERO_DATENSCHUTZ | datenschutz-datensicherheit-hero.webp | datenschutz.html |
| 9 | IMG_HERO_IMPRESSUM | impressum-buero-blitz-leihen-hero.webp | impressum.html |
| 10 | IMG_HERO_SCHUFA_NEGATIV | kredit-trotz-schufa-hero.webp | ratgeber/kredit-trotz-negativer-schufa.html |
| 11 | IMG_HERO_KREDITANTRAG_ABLAUF | kreditantrag-ablauf-prozess-hero.webp | ratgeber/kreditantrag-ablauf-dauer.html |
| 12 | IMG_HERO_RATENKREDIT_DISPO | ratenkredit-dispokredit-vergleich-hero.webp | ratgeber/ratenkredit-vs-dispokredit.html |
| 13 | IMG_HERO_SCHUFA_SCORE | schufa-score-verbessern-hero.webp | ratgeber/schufa-score-verbessern.html |
| 14 | IMG_HERO_UEBER_UNS | ueber-uns-team-blitz-leihen-hero.webp | ueber-uns.html |

## ⚠️ Page non concernée : `404.html`
Cette page n'a volontairement **pas** reçu de hero avec photo : elle est en
`noindex` (aucun bénéfice SEO possible) et n'a pas de structure de hero du
tout — c'est une simple page de redirection centrée, avec du texte sombre
sur fond clair. Lui ajouter une photo demanderait de repenser tout son design
(texte blanc, overlay sombre) pour un gain nul en référencement. Dites-moi si
vous souhaitez tout de même l'harmoniser visuellement.

---

## Effet 5 — Vignettes des cartes articles (page ratgeber.html)
**Format : 800×600px (4:3)** — remplace l'icône emoji sur fond bleu dégradé
en haut de chaque carte (`.ratgeber-card__img`, actuellement 160px de haut).

### IMG_CARD_SCHUFA_SCORE — carte "Schufa-Score verbessern: 7 wirksame Tipps"
**Nom de fichier recommandé :** `schufa-score-tipps-card.webp`
**Prompt :**
> Photorealistic close-up of an upward-trending bar chart on a tablet or paper report, green and blue bars rising, soft natural light, symbolic of credit score improvement, navy and gold color accents, shallow depth of field, no readable text or logos — 4:3

### IMG_CARD_SCHUFA_NEGATIV — carte "Kredit trotz negativer Schufa: Ihre Möglichkeiten"
**Nom de fichier recommandé :** `kredit-trotz-schufa-card.webp`
**Prompt :**
> Photorealistic close-up of a person reviewing a credit report document with a magnifying glass, focused and thoughtful mood, soft warm light, navy and gold tones, shallow depth of field, no readable text or logos — 4:3

### IMG_CARD_RATENKREDIT_DISPO — carte "Ratenkredit vs. Dispokredit: Was ist günstiger?"
**Nom de fichier recommandé :** `ratenkredit-dispokredit-card.webp`
**Prompt :**
> Photorealistic symbolic image of a balance scale weighing two financial options, or two paths diverging on a desk with documents, soft daylight, navy and gold tones, clean minimalist composition, no readable text or logos — 4:3

### IMG_CARD_KREDITANTRAG_ABLAUF — carte "Kreditantrag: Ablauf, Dauer und benötigte Unterlagen"
**Nom de fichier recommandé :** `kreditantrag-ablauf-card.webp`
**Prompt :**
> Photorealistic organized desk with neatly arranged documents, a folder, and a checklist on a tablet, soft natural light, sense of clear process and order, navy and gold tones, shallow depth of field, no readable text or logos — 4:3
