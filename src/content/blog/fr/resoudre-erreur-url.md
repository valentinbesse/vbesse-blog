---
title: "Astro & SEO : Résoudre l'erreur d'URL [object Object] sur vos images OpenGraph"
description: "Vos images sociales ont disparu sur LinkedIn ou Bluesky ? Découvrez pourquoi Astro génère parfois un [object Object] dans vos balises meta et comment le corriger définitivement."
pubDate: "2026-02-25"
image: "../../../assets/astro-seo-bug.png"
imageAlt: "Un insecte (bug) numérique essayant de lire un code source flou avec la mention object Object. Image générée par IA."
imageCaption: "Le cauchemar des développeurs JavaScript a encore frappé. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "SEO", "Quick Tip", "Debugging"]
---

Vous venez de publier un article, vous partagez le lien sur LinkedIn ou Bluesky, et là... aucune image de prévisualisation n'apparaît. Juste un titre triste et un grand espace vide.

En inspectant le code source de votre page, vous tombez sur cette horreur dans la balise `<head>` :

```html
<meta property="og:image" content="[https://vbesse.com/](https://vbesse.com/)[object%20Object]">
```

Le fameux `[object Object]` a encore frappé. Pas de panique, c'est une erreur classique quand on manipule des images dans Astro. Voici pourquoi cela arrive et comment blinder votre composant `BaseHead.astro` une bonne fois pour toutes.

## Pourquoi Astro fait-il ça ?

Il y a généralement deux coupables derrière ce comportement :

### 1. Le piège des images locales (Content Collections)

Si vous utilisez les imports d'images natifs d'Astro (par exemple dans votre frontmatter : `image: "../../assets/mon-image.png")`, Astro fait un travail formidable d'optimisation en arrière-plan.

Mais lorsqu'il vous renvoie la variable `image`, ce n'est pas une simple chaîne de caractères. C'est un objet complexe qui ressemble à ça :
`{ src: '/_astro/mon-image.png', width: 800, height: 600 }`.

Si vous passez directement cet objet à l'attribut `content` de votre balise `<meta>`, le navigateur tente de le lire comme du texte et recrache `[object Object]`.

### 2. L'oubli du `.href` avec `new URL()`

Pour que les réseaux sociaux acceptent vos images, l'URL doit être absolue (commencer par `https://`). On utilise souvent la fonction native `new URL(chemin, Astro.site)`.
Cependant, cette fonction retourne un **objet URL**, pas un texte. Il faut extraire explicitement la chaîne de caractères finale avec `.href`.

## La solution : Le BaseHead indestructible 🛡️

Pour régler ce problème, nous allons modifier notre composant `<BaseHead />` pour qu'il soit capable d'accepter n'importe quoi (un objet Astro, une URL dynamique Satori, ou rien du tout) et de recracher systématiquement une URL absolue propre.

Voici le code JavaScript (dans le frontmatter de votre `BaseHead.astro`) :

```javascript
---
const { title, description, image } = Astro.props;

// 1. Construction de l'URL Canonique
const canonicalURL = new URL(Astro.url.pathname, Astro.site);

// 2. Extraction du slug de la page actuelle
const slug = canonicalURL.pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .pop();

// 3. Définition du chemin de l'image (L'ordre de priorité)
let imagePath;

if (image) {
    // Cas A : Une image est fournie (via le Frontmatter)
    // On vérifie son type. Si c'est l'objet d'Astro, on extrait .src !
    imagePath = typeof image === 'object' ? image.src : image;
} else if (slug) {
    // Cas B : Pas d'image, mais c'est un article (Génération automatique Satori)
    imagePath = `/og/${slug}.png`;
} else {
    // Cas C : Le Fallback par défaut
    imagePath = '/default-image.png';
}

// 4. Génération de la string absolue finale
const socialImageURL = new URL(imagePath, Astro.site).href; // <-- Le .href sauve des vies
---

<meta property="og:image" content={socialImageURL} />
<meta name="twitter:image" content={socialImageURL} />
```

## L'étape finale : Vider le cache

Vous avez corrigé votre code, poussé en production, mais LinkedIn s'obstine à ne pas afficher votre image ? C'est normal, la plateforme a mis votre lien en cache avec l'ancienne erreur.

1. Allez sur le [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
2. Entrez l'URL de votre article.
3. Cliquez sur "Inspect".

Cela forcera les robots à relire vos balises toutes neuves. Vos images sociales sont de retour !
