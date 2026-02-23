---
title: "Fini les liens tristes : Générer des images sociales (OG) automatiques avec Astro"
description: "Marre de créer une image sur Figma pour chaque article ? Découvrez comment générer vos images OpenGraph dynamiquement à la compilation avec Astro et Satori."
pubDate: "2026-02-23"
image: "../../assets/og-images-automation.png"
imageAlt: "Illustration montrant du code se transformant automatiquement en cartes de prévisualisation pour les réseaux sociaux. Image générée par IA."
imageCaption: "De la donnée brute à la prévisualisation sociale : l'automatisation au service du partage. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "SEO", "OpenGraph", "Automatisation"]
---

Vous venez de passer trois heures à peaufiner un article technique pointu. Vous copiez le lien, vous le collez fièrement sur LinkedIn ou Discord et là... c'est le drame.

Un vieux logo pixelisé apparaît, ou pire, une zone grise vide. Votre lien est "triste".

Le taux de clic d'un lien sans image sociale (OpenGraph) s'effondre. Mais ouvrir Figma pour créer une vignette à chaque nouvel article est une tâche répétitive et chronophage. Et si nous laissions Astro s'en charger à notre place ?

## Qu'est-ce qu'une image OpenGraph ?

L'OpenGraph est un protocole créé à l'origine par Facebook pour standardiser la façon dont les pages web sont représentées sur les réseaux sociaux.

Techniquement, ce sont de simples balises `<meta>` situées dans le `<head>` de votre page :

```html
<meta property="og:image" content="[https://vbesse.com/og/mon-article.png](https://vbesse.com/og/mon-article.png)" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="[https://vbesse.com/og/mon-article.png](https://vbesse.com/og/mon-article.png)" />
```

Le défi n'est pas d'ajouter ces balises, mais de créer le fichier `.png` qui correspond à l'URL.

## L'approche Astro : Les Endpoints (Points de terminaison)

La magie d'Astro, c'est qu'il ne génère pas que du HTML. Il peut générer du JSON, du XML (pour les flux RSS, on en parlera !), et même des images à la volée grâce aux **Endpoints**.

Plutôt que de créer une page `.astro`, nous allons créer un fichier `.ts` dans notre dossier de routage.

### 1. Créer le générateur Satori

Le standard de l'industrie pour générer ces images par le code s'appelle Satori (développé par Vercel). Il convertit du HTML/CSS en SVG, que nous transformons ensuite en PNG.

Créez un fichier `src/pages/og/[slug].png.ts`. Ce fichier va générer une image unique pour chaque article de votre blog.

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
// (Imports fictifs pour l'exemple : satori et resvg-js)
import { generateImage } from '../../utils/og-generator'; 

// 1. Astro liste tous nos articles pour savoir quelles images générer
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, description: post.data.description },
  }));
}

// 2. Astro crée le fichier PNG pour chaque article
export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props;
  
  // Notre fonction magique qui prend le titre et renvoie un buffer PNG
  const pngBuffer = await generateImage(title, description);

  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
};
```

## Le Design par le Code

Grâce à Satori, vous n'avez pas besoin d'apprendre un langage graphique complexe. Vous designez votre image de couverture en utilisant du HTML flexbox classique et du CSS !

Voici à quoi ressemble le template passé au générateur :

``` js
<div style={{ display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', background: '#1a1a1a', color: 'white', padding: '80px' }}>
  <h1 style={{ fontSize: '64px', fontWeight: 'bold' }}>{title}</h1>
  <p style={{ fontSize: '32px', color: '#a1a1aa' }}>{description}</p>
  
  <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center' }}>
    <img src="[https://vbesse.com/avatar.jpg](https://vbesse.com/avatar.jpg)" width="80" height="80" style={{ borderRadius: '50%' }} />
    <span style={{ fontSize: '32px', marginLeft: '20px' }}>vbesse.com</span>
  </div>
</div>
```

## Connecter l'image au Layout

Maintenant que nos images sont générées dans le dossier `/og/`, il suffit de dire à notre article d'aller les chercher.

Souvenez-vous de notre `BlogPost.astro` de l'article précédent. Il suffit de lui passer la bonne URL :

```astro
---
// src/layouts/BlogPost.astro
import BaseHead from '../components/BaseHead.astro';
const { frontmatter, slug } = Astro.props;

// On construit dynamiquement le lien vers notre nouvelle image
const ogImageUrl = new URL(`/og/${slug}.png`, Astro.site);
---

<html lang="fr">
  <head>
    <BaseHead 
      title={frontmatter.title} 
      description={frontmatter.description} 
      image={ogImageUrl} 
    />
  </head>
  </html>
```

## Conclusion

En investissant une heure pour configurer Satori et un endpoint Astro, vous vous libérez définitivement de la corvée de création d'images.

À chaque `npm run build`, Astro lit vos articles, génère les fichiers PNG correspondants avec le bon titre, et les injecte dans vos balises Meta.

Vos liens ne seront plus jamais tristes. Et vos lecteurs auront (enfin) envie de cliquer dessus.
