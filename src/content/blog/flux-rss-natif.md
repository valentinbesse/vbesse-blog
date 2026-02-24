---
title: "Redonner le pouvoir aux lecteurs : Ajouter un flux RSS natif en 5 minutes"
description: "Fuyez les algorithmes ! Découvrez comment générer un flux RSS valide en quelques lignes de code sur votre blog Astro."
pubDate: "2026-02-24"
image: "../../assets/rss-feed-astro.png"
imageAlt: "Illustration d'un flux d'ondes orange vif symbolisant le protocole RSS, traversant un paysage numérique épuré. Image générée par IA."
imageCaption: "Le web indépendant fait de la résistance. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "RSS", "IndieWeb", "Tutoriel"]
---

Dans mon précédent article sur la génération d'images OpenGraph, je vous glissais qu'Astro ne servait pas qu'à générer des pages HTML, mais aussi du XML. Promesse tenue : aujourd'hui, on s'attaque au monument du web indépendant, le **flux RSS**.

Pendant des années, on a cru le RSS mort, tué par les algorithmes des réseaux sociaux qui voulaient nous garder captifs sur leurs plateformes. Mais la fatigue algorithmique est réelle. De plus en plus de développeurs (moi le premier) retournent vers des agrégateurs (comme Feedly ou NetNewsWire) pour reprendre le contrôle de leur veille.

Si vous avez un blog tech, proposer un flux RSS n'est plus optionnel, c'est une marque de respect pour vos lecteurs. Et avec Astro, cela prend littéralement 5 minutes.

## 1. L'outil officiel

L'équipe d'Astro a eu la bonne idée de créer une intégration officielle parfaite pour ça. Commencez par l'installer :

```bash
npm install @astrojs/rss
```

Note : Assurez-vous d'avoir bien défini la propriété `site` dans votre fichier `astro.config.mjs` (ex: `site: 'https://vbesse.com'`), car le générateur en aura besoin pour créer des liens absolus.

## 2. Créer l'Endpoint XML

Tout comme pour nos images dynamiques, nous n'allons pas créer une page classique, mais un "Endpoint".

Créez un fichier `src/pages/rss.xml.ts`. Astro comprendra automatiquement qu'il doit générer un fichier XML à la racine de votre site lors du build.

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // On récupère tous nos articles de blog
  const blog = await getCollection('blog');

  return rss({
    // Les métadonnées globales de votre flux
    title: 'Le Blog de Valentin Besse',
    description: 'Bienvenue sur mon blog tech. On parle de code, d\'Astro et de legacy.',
    // Le contexte fournit automatiquement l'URL de votre site
    site: context.site,
    // On boucle sur nos articles pour créer les items du flux
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // On génère le lien absolu vers l'article
      link: `/blog/${post.slug}/`,
    })),
    // Optionnel : On précise la langue pour les lecteurs
    customData: `<language>fr-fr</language>`,
  });
}
```

Et... c'est tout pour la génération ! Si vous lancez votre serveur de développement et allez sur `/rss.xml`, vous verrez une magnifique page de code XML brute. Vos futurs lecteurs pourront copier ce lien dans leur agrégateur préféré.

## 3. L'Auto-découverte (L'étape que tout le monde oublie)

Générer le flux, c'est bien. Mais encore faut-il que les navigateurs et les applications de lecture sachent qu'il existe sans que l'utilisateur n'ait à chercher le lien manuellement.

C'est là que notre fameux composant d'architecture `BaseHead.astro` (dont on a parlé il y a quelques jours) brille à nouveau.

Ajoutez cette simple ligne dans votre balise `<head>` :

```html
<link 
  rel="alternate" 
  type="application/rss+xml" 
  title="Le Blog de Valentin Besse" 
  href={new URL("rss.xml", Astro.site)} 
/>
```

Grâce à cette balise `rel="alternate"`, les extensions de navigateur et les agrégateurs détecteront automatiquement la présence de votre flux dès qu'un visiteur arrivera sur votre site.

Conclusion
En moins de temps qu'il n'en faut pour scroller machinalement son fil LinkedIn, nous venons de rendre notre contenu accessible de manière asynchrone, pérenne et décentralisée.

Le web appartient de nouveau aux lecteurs. Abonnez-vous à mon flux (le bouton est dans le footer !) pour ne pas rater le prochain article.
