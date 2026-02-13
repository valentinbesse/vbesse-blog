---
title: "Fini les images de 10 Mo : Mon pipeline d'optimisation automatique avec Astro"
description: "Comment je suis passé d'une gestion manuelle fastidieuse à un workflow entièrement automatisé grâce aux Content Collections et Astro Assets."
pubDate: "2026-02-13"
image: "../../assets/pipeline-images.png"
imageAlt: "Un schéma technique montrant une image brute entrant dans un entonnoir 'Astro Assets' et en ressortant optimisée en WebP sur différents écrans."
imageCaption: "Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
---

L'autre jour, j'ai voulu publier un article rapidement. J'ai généré une image de couverture avec l'IA, je l'ai uploadée, et j'ai poussé le tout en ligne.

Résultat ? Une page qui mettait 5 secondes à charger sur mobile.
La raison ? Mon image pesait **10 Mo**.

J'avais deux choix :

1. Passer chaque image manuellement dans un outil comme [Squoosh](https://squoosh.app/) avant de la publier (fastidieux et sujet à l'oubli).
2. Construire un système qui le fait pour moi automatiquement.

En bon développeur (c'est-à-dire un peu fainéant sur les tâches répétitives), j'ai choisi l'option 2. Voici comment j'ai mis en place un pipeline d'images robuste avec **Astro Assets** et les **Content Collections**.

## Le problème du dossier `public/`

Au départ, je stockais mes images dans le dossier `public/`.
Dans Astro (et beaucoup d'autres frameworks), ce dossier est une "zone franche". Les fichiers y sont servis tels quels, sans modification. Si vous y mettez un PNG de 4000px de large, l'utilisateur téléchargera un PNG de 4000px, même sur son smartphone.

C'est désastreux pour la performance et le SEO.

## La solution : `src/assets/` et les Collections

Pour qu'Astro puisse optimiser les images, il faut qu'il puisse les "voir" et les traiter lors du build. J'ai donc déplacé mes images dans un dossier protégé : `src/assets/`.

Mais cela demandait de revoir la façon dont mon blog gère les articles. J'ai migré vers les **Content Collections**, une fonctionnalité puissante d'Astro pour gérer du contenu typé (Markdown, MDX, JSON).

### 1. Définir le schéma (Le Cerveau)

La première étape a été de définir la structure de mes articles dans un fichier de configuration (`src/content/config.ts`).

C'est ici que la magie opère grâce au helper `image()` de [Zod](https://zod.dev/). Il valide automatiquement que le fichier passé dans le frontmatter est bien une image existante.

``` typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        pubDate: z.string(),
        // Astro va valider et préparer l'image ici
        image: image().optional(),
        // J'en profite pour ajouter des champs pour l'accessibilité et la transparence
        imageAlt: z.string().optional(),
        imageCaption: z.string().optional(),
        aiDisclaimer: z.string().optional(),
    }),
});

export const collections = {
    'blog': blogCollection,
};
```

### 2. Le composant `<Image />` (Les Muscles)

Une fois la configuration faite, j'ai mis à jour mon Layout pour ne plus utiliser la balise HTML standard `<img>`, mais le composant optimisé d'Astro.

Ce composant fait tout le travail lourd à ma place :

- Il convertit l'image en formats modernes (WebP ou AVIF).
- Il redimensionne l'image.
- Il génère les attributs width et height pour éviter le layout shift (le contenu qui saute quand l'image charge).

Voici à quoi ressemble mon code maintenant :

``` astro
---
import { Image } from 'astro:assets';
const { frontmatter } = Astro.props;
---

<figure>
    <Image 
        src={frontmatter.image} 
        alt={frontmatter.imageAlt || frontmatter.title} 
        format="webp"
        class="hero-image"
    />
    
    {frontmatter.imageCaption && (
        <figcaption>{frontmatter.imageCaption}</figcaption>
    )}
</figure>
```

### 3. Le résultat (La Récompense)

Aujourd'hui, mon workflow est idéal :

1. Je dépose une image brute (même lourde) dans src/assets.
2. Je référence cette image dans mon fichier Markdown : image: "../../assets/mon-image.png".
3. Astro fait le reste.

Lors du déploiement, l'image de 10 Mo est transformée en un fichier WebP de 150 Ko, parfaitement dimensionné.

### Bonus : Transparence et Accessibilité

J'ai profité de cette refonte pour structurer mes métadonnées. J'ai ajouté des champs obligatoires ou optionnels dans mon schéma pour :

- Le texte alternatif (alt) : Crucial pour l'accessibilité.
- La légende (caption) : Pour donner du contexte.
- Le disclaimer IA : Une petite mention automatique en bas d'article si le contenu a été assisté par une IA.

C'est l'avantage d'avoir un blog "fait maison" : on a le contrôle total sur la qualité technique et éthique de ce qu'on publie.