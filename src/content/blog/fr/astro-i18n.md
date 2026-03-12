---
title: "Astro & i18n : Rendre son blog bilingue sans sacrifier les View Transitions"
description: "Comment j'ai implémenté un système multilingue natif sur mon blog Astro, avec des URLs propres et un sélecteur de langue dynamique résistant au ClientRouter. Merci Cristian !"
pubDate: "2026-03-12"
image: "../../../assets/astro-i18n-hreflang-schema.png"
imageAlt: "Schéma expliquant le fonctionnement de la balise HTML hreflang pour lier deux articles traduits. Image générée par IA."
imageCaption: "Le lien invisible qui unit vos deux articles pour les moteurs de recherche. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "i18n", "JavaScript", "SEO", "Web Performance"]
translation: "astro-i18n-view-transitions"
---

Il y a peu, en discutant avec mon ami **[Cristian Fernández Del Pozo](https://www.linkedin.com/in/cferndp/)**, une idée a émergé : *"On a besoin d'une version anglaise de tes posts"*.

L'idée était séduisante. Mais sur le plan technique, elle posait un beau défi. Mon blog utilise **Astro**, et plus particulièrement le `ClientRouter` (les fameuses View Transitions) pour offrir une navigation ultra-fluide digne d'une SPA, avec un Header persistant.

Comment proposer un site bilingue, lier les articles traduits entre eux, optimiser le SEO, le tout sans casser cette fluidité et sans rechargement de page ? Voici comment j'ai construit mon propre système i18n de A à Z.

## 1. La structure : Séparer le contenu à la source

Plutôt que d'utiliser des bibliothèques tierces parfois lourdes, j'ai misé sur la puissance des *Content Collections* d'Astro. J'ai divisé mon dossier `src/content/blog/` en deux sous-dossiers : `/fr/` et `/en/`.

Pour le routage, j'utilise des routes dynamiques "catch-all" (`[...slug].astro`).

* `src/pages/blog/[...slug].astro` filtre et génère les articles français.
* `src/pages/en/blog/[...slug].astro` s'occupe de la version anglaise.

## 2. Le "Translation Mapping" (Le secret)

Le plus gros problème d'un blog bilingue, ce sont les URLs. Mon article en français s'appelle `hello-vbesse`, mais sa version anglaise s'appelle `welcome`. Comment dire à mon site que ces deux pages sont des jumelles ?

J'ai ajouté un champ `translation` dans le frontmatter de mes articles :

```yaml
---
title: "Bienvenue sur vbesse.com"
translation: "welcome"
---
```

*(Remarque : dans la version française du fichier, le champ de traduction pointe vers le slug anglais !)*

Dans mes fichiers de routage `[...slug].astro`, je récupère cette donnée pour construire l'URL de l'article alternatif, et je la fais remonter jusqu'à mon Layout principal via les `Astro.props`.

## 3. Le SEO International

Une fois l'URL de traduction récupérée dans mon composant `<BaseHead />`, je l'utilise pour injecter une balise cruciale pour le référencement international :

``` astro
{translationUrl && (
    <link rel="alternate" id="alt-link" href={translationUrl} hreflang={locale === 'fr' ? 'en' : 'fr'} />
)}
```

Cette balise dit aux moteurs de recherche : *"Hé, si un lecteur anglais cherche cet article, voici la version qu'il faut lui montrer"*. J'ai d'ailleurs profité de ce chantier pour séparer mes flux RSS en deux endpoints distincts (`rss.xml` et `en/rss.xml`).

# 4. Le Boss Final : Le Header et les View Transitions

C'est ici que les choses se corsent. Mon composant `<Header />` est persistant. Quand on navigue d'une page à l'autre, Astro remplace le contenu du `<main>`, mais le Header, lui, ne se recharge pas.

Si je suis sur un article A et que je clique sur un article B, mon bouton "English" dans le menu pointait toujours vers la traduction de l'article A.

Pour corriger ça, j'ai écrit un petit script JavaScript vanilla qui s'exécute **à chaque changement de page** grâce à l'événement `astro:page-load` :

``` javascript
document.addEventListener("astro:page-load", () => {
    // 1. On cherche la balise SEO générée dans le Head
    const altLink = document.getElementById('alt-link');
    const customTarget = altLink ? altLink.getAttribute('href') : null;

    // 2. On met à jour le sélecteur de langue
    const frLangLink = document.querySelector('.lang-picker a[data-lang="fr"]');
    const enLangLink = document.querySelector('.lang-picker a[data-lang="en"]');
    
    // ... Logique pour injecter 'customTarget' dans le href du bouton ...
});
```

**La magie opère :** À chaque navigation, le script lit silencieusement le `<head>` de la nouvelle page, trouve l'URL de traduction, et met à jour le bouton du menu. Le tout de manière invisible pour l'utilisateur.

## Conclusion

Rendre un site bilingue demande un peu d'ingénierie, surtout quand on veut conserver une navigation de type SPA. Mais en utilisant les outils natifs d'Astro (Content Collections, routage dynamique, et le cycle de vie du ClientRouter), on obtient une architecture robuste, performante et excellente pour le SEO.

Un immense merci à Cristian pour l'impulsion de départ. Mon blog est maintenant prêt à conquérir le web anglophone !
