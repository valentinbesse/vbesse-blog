---
title: "Parler la langue de Google : JSON-LD et SEO technique automatisé"
description: "Arrêtez de laisser Google deviner le contenu de vos pages. Apprenez à générer automatiquement des données structurées JSON-LD avec Astro pour booster votre SEO."
pubDate: "2026-02-26"
image: "../../assets/json-ld-astro-seo.png"
imageAlt: "Un robot de moteur de recherche lisant un parchemin numérique contenant du code JSON structuré. Image générée par IA."
imageCaption: "Donnez à Google les clés de votre contenu. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "SEO", "JSON-LD", "Google"]
---

Quand on parle de SEO, on pense souvent aux mots-clés, aux balises `<h1>` ou aux méta-descriptions. C'est essentiel, mais aujourd'hui, les moteurs de recherche veulent plus : ils veulent du **contexte**.

Comment Google sait-il que votre page est un "Article de blog" écrit par une "Personne" spécifique, publié à une "Date" précise, plutôt qu'une simple page de texte vrac ?

La réponse tient en six lettres : **JSON-LD** (JavaScript Object Notation for Linked Data).

## Le problème : Laisser Google deviner

Sans données structurées, les robots d'indexation doivent parser votre HTML et "deviner" ce qui est important. Parfois ils réussissent, souvent ils se trompent.

Avec le JSON-LD, on ne laisse plus de place au doute. On injecte un petit script invisible pour l'utilisateur, mais qui dit explicitement aux robots : *"Ceci est un article de blog technique, voici le titre exact, l'URL de l'image de couverture, et l'identité de l'auteur."*

Le bonus ? C'est ce qui vous permet d'obtenir les fameux **Rich Snippets** (extraits enrichis) dans les résultats de recherche.

## L'automatisation avec Astro

Écrire ce JSON à la main pour chaque article serait un enfer. Heureusement, la puissance des composants Astro nous permet d'automatiser ça complètement.

### 1. Préparer le BaseHead

Si vous avez suivi mes précédents articles sur l'architecture de ce blog, vous savez que j'ai un composant `BaseHead.astro` qui gère tout mon `<head>`.

Il suffit de lui dire d'accepter une nouvelle propriété `schema` et de l'injecter si elle existe :

```astro
---
// src/components/BaseHead.astro
const { title, description, image, schema } = Astro.props;

// ... (logique des URLs d'images OpenGraph vue précédemment)
---

<title>{title}</title>
<meta name="description" content={description} />

{schema && (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
)}
```

*Note : L'attribut `set:html` est crucial ici. Il indique à Astro d'injecter la chaîne de caractères brute dans la balise script sans l'échapper.*

### 2. Générer le Schema dans le Layout de l'Article

Maintenant, allons dans le layout qui gère nos articles de blog (`src/layouts/BlogPost.astro`). C'est ici que nous avons toutes les données : le titre, la date, l'image sociale, etc.

Nous allons construire un objet JavaScript respectant le standard [Schema.org](https://schema.org/) pour le type `BlogPosting`.

``` astro
---
// src/layouts/BlogPost.astro
import BaseHead from '../components/BaseHead.astro';
const { frontmatter, slug } = Astro.props;

// Notre URL d'image générée dynamiquement (Satori)
const ogImageUrl = new URL(`/og/${slug}.png`, Astro.site).href;
const articleUrl = new URL(Astro.url.pathname, Astro.site).href;

// 🧠 La construction du Schema JSON-LD
const schema = {
  "@context": "[https://schema.org](https://schema.org)",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": articleUrl
  },
  "headline": frontmatter.title,
  "description": frontmatter.description,
  "image": [ogImageUrl],
  "datePublished": frontmatter.pubDate,
  // Ajoutez dateModified si vous gérez les mises à jour !
  "author": {
    "@type": "Person",
    "name": "Valentin Besse",
    "url": "[https://vbesse.com](https://vbesse.com)"
  }
};
---

<html lang="fr">
  <head>
    <BaseHead 
      title={frontmatter.title} 
      description={frontmatter.description} 
      schema={schema} 
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Le test ultime

Une fois ce code en place, lancez un build de votre site et ouvrez le code source d'un article. Vous y verrez votre magnifique script JSON-LD prêt à être dévoré par Googlebot.

Pour être sûr à 100% que votre syntaxe est parfaite, copiez l'URL de votre article (ou le code source généré) et collez-le dans le [Test d'optimisation pour les résultats enrichis de Google](https://search.google.com/test/rich-results).

Si tout est vert, félicitations : vous parlez couramment la langue des moteurs de recherche.
