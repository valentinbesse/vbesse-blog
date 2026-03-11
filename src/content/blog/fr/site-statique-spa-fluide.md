---
title: "L'illusion parfaite : Transformer un site statique en SPA fluide avec Astro ClientRouter"
description: "Découvrez comment le composant ClientRouter d'Astro utilise l'API View Transitions pour transformer votre site statique en une application ultra-fluide sans le poids d'un framework JavaScript."
pubDate: "2026-03-04"
image: "../../../assets/astro-client-router-spa.png"
imageAlt: "Un portail magique reliant deux pages web de manière fluide et transparente. Image générée par IA."
imageCaption: "Naviguer sans recharger. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "JavaScript", "UX", "Performance", "SPA"]
translation: "astro-clientrouter-smooth-spa"
---

Le monde du développement web a longtemps été divisé en deux camps.

D'un côté, les puristes du **Site Statique (MPA)** : des temps de chargement imbattables, un SEO parfait, mais un "clignotement" blanc à chaque changement de page car le navigateur détruit et recrée tout le DOM.
De l'autre, les fans de la **Single Page Application (SPA)** avec React, Vue ou Angular : une navigation ultra-fluide sans rechargement, mais au prix d'un lourd bundle JavaScript à télécharger et d'une complexité accrue.

Et si je vous disais qu'avec Astro, vous pouvez avoir le beurre et l'argent du beurre ? Un site 100% statique généré côté serveur, mais qui se comporte exactement comme une SPA fluide côté client.

La magie tient en un seul composant : `<ClientRouter />`.

## Comment ça marche ?

Astro s'appuie sur une technologie récente des navigateurs appelée **View Transitions API**.

Plutôt que de laisser le navigateur recharger brutalement la page complète lors d'un clic sur un lien, Astro intercepte ce clic. Il va chercher le HTML de la nouvelle page en arrière-plan, puis il "fusionne" intelligemment l'ancien DOM avec le nouveau, en animant la transition entre les deux.

Le résultat ? L'utilisateur a l'illusion parfaite de naviguer dans une application, alors qu'il consulte de simples fichiers HTML statiques.

## L'implémentation (littéralement 2 lignes de code)

C'est là que l'expérience développeur d'Astro brille. Pour activer cette fonctionnalité sur l'ensemble de votre site, il vous suffit de modifier votre balise `<head>`.

Si vous avez suivi mes précédents articles, vous savez que j'utilise un composant `BaseHead.astro` commun à toutes mes pages. C'est là que la magie opère :

```astro
---
// src/components/BaseHead.astro
import { ClientRouter } from 'astro:transitions';

const { title, description } = Astro.props;
---

<head>
  <meta charset="utf-8" />
  <title>{title}</title>
  <meta name="description" content={description} />
  
  <ClientRouter />
</head>
```

Et... c'est tout. Naviguez maintenant sur votre site : le rechargement brutal a disparu, remplacé par un subtil fondu enchaîné par défaut. L'état de votre page (comme la position de lecture ou une vidéo en cours) peut même être conservé entre les navigations !

## Le petit piège : Le cycle de vie du JavaScript

Si l'illusion visuelle est parfaite, elle l'est aussi pour votre code JavaScript Vanilla.

Puisque le navigateur ne fait plus de vrai "rechargement de page", les événements classiques comme `DOMContentLoaded` ou `window.onload` ne se déclencheront plus lorsque l'utilisateur naviguera d'un article à l'autre.

Si vous avez des scripts pour gérer un menu mobile, un carrousel ou, comme on l'a vu récemment, un formulaire de contact en AJAX, ils risquent de ne fonctionner que sur la première page visitée.

Heureusement, Astro a prévu le coup en remplaçant ces événements natifs par les siens. Au lieu d'écouter le chargement classique du DOM, il faut désormais écouter l'événement `astro:page-load` :

```javascript
// Avant (Ne marchera qu'au premier chargement du site)
document.addEventListener('DOMContentLoaded', () => {
  initMonMenuMobile();
});

// Avec ClientRouter (Marchera à chaque changement de page)
document.addEventListener('astro:page-load', () => {
  initMonMenuMobile();
});
```

## Conclusion

L'intégration du `ClientRouter` dans Astro est un véritable "Game Changer". En ajoutant simplement deux lignes de code, vous offrez à vos visiteurs une expérience premium, digne des plus grosses applications web, tout en gardant une architecture simple, légère et performante.

C'est une victoire totale pour l'UX et pour les développeurs. Attention cependant à bien revoir vos scripts JavaScript pour qu'ils survivent à cette nouvelle fluidité (on parlera justement du piège du menu mobile dans un prochain article !).
