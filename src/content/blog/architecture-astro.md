---
title: "Architecture Astro : Pourquoi j'ai éclaté mon Layout monolithique"
description: "Découvrez pourquoi séparer votre Layout principal en sous-couches spécialisées est la clé d'un blog Astro maintenable et évolutif."
pubDate: "2026-02-20"
image: "../../assets/architecture-modulaire.png"
imageAlt: "Illustration montrant des blocs cubiques colorés s'emboîtant de manière modulaire, symbolisant une architecture logicielle propre et décomposée. Image générée par IA."
imageCaption: "Passer d'un bloc monolithique à une structure modulaire : la clé d'un code maintenable. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "Architecture", "Clean Code", "WebDev"]
---

Au début de ce blog, tout semblait simple. J'avais un fichier `Layout.astro`. Il gérait le SEO, le Header, le Footer, les polices, et même quelques scripts spécifiques à la page d'accueil. C'était mon "Layout à tout faire".

Mais à mesure que j'ajoutais une page de contact, une recherche Pagefind, et des articles complexes, ce fichier est devenu un **monolithe ingérable**. Chaque modification pour un article risquait de casser l'affichage de la page d'accueil.

Voici pourquoi (et comment) j'ai décidé de tout éclater.

## Le problème du Layout "Couteau Suisse"

Un Layout monolithique souffre de trois défauts majeurs :

1. **La pollution cognitive** : Trop de logique conditionnelle (`{isHomePage && <Hero />}`).
2. **Le poids inutile** : Charger des scripts de recherche sur une page de contact qui n'en a pas besoin.
3. **La rigidité** : Difficile de changer la structure d'un article sans impacter le reste du site.

## La solution : Le pattern de l'oignon 🧅

J'ai déconstruit mon architecture en couches spécialisées. Au lieu d'un seul bloc, j'utilise maintenant une imbrication de layouts.

### 1. La Base (BaseLayout.astro)

C'est le squelette HTML pur. Il ne contient que ce qui est **commun à 100% du site** :

- La balise `<!DOCTYPE html>` et `<html>`.
- Le `<head>` avec les meta-données globales et les favicons.
- La structure `<body>` avec le `<Header />` et le `<Footer />`.
- Le composant `<ClientRouter />` pour les transitions fluides.

### 2. La Couche SEO (SEO.astro)

Plutôt que de gérer les balises OpenGraph (pour LinkedIn/Bluesky) directement dans le layout, j'ai créé un composant dédié. Il reçoit des props et génère les balises dynamiquement.

### 3. Les Layouts Spécialisés

C'est ici que la magie opère. J'ai créé des "sous-layouts" qui utilisent les composants de bases :

- **Layout.astro** : Pour les pages statiques simples (Contact, À propos). Il centre le contenu et gère les marges standards.
- **BlogPost.astro** : Dédié aux articles de blog. C'est lui qui gère la Table des Matières, la barre de progression de lecture, et les scripts de coloration syntaxique.

## À quoi ressemble le code maintenant ?

Aujourd'hui, mon fichier `src/layouts/Layout.astro` ressemble à ça :

```astro
---
import Analytics from "@vercel/analytics/astro";
import BaseHead from "../components/BaseHead.astro"; // <-- Le nouveau chef d'orchestre
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";

const {
    title = "Le Blog de Valentin Besse",
    description = "Bienvenue sur mon blog tech. On parle de code, d'Astro et de legacy.",
    image,
    schema,
} = Astro.props;
---

<!doctype html>
<html lang="fr">
    <head>
        <BaseHead
        title={title}
        description={description}
        image={image}
        schema={schema}
        />
    </head>
    <body>
        <a href="#main-content" class="skip-link">Aller au contenu principal</a>
        <Header />
        <main id="#main-content">
            <slot />
        </main>
        <Footer />
        <Analytics />
    </body>
</html>
```

## Les bénéfices immédiats

1. **Maintenance facilitée** : Si je veux modifier mon Footer, je sais que j'ai un component dédié spécifique. Si je veux changer le design de mes articles, c'est dans BlogPost.
2. **Performance** : Je ne charge le script de la barre de progression que dans le layout des articles.
3. **Clarté** : Mes pages de contenu sont redevenues extrêmement simples à lire.

## Conclusion

Si vous lancez un projet Astro, ne tombez pas dans le piège du Layout unique. **Séparez les responsabilités dès le départ**. Pensez votre architecture comme un ensemble de pièces de LEGO que vous emboîtez selon les besoins de chaque page.

Votre futur "vous", celui qui devra corriger un bug dans 6 mois, vous en remerciera.