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
