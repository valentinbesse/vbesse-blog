---
title: "3 micro-fonctionnalités pour une UX de lecture parfaite"
description: "Le contenu est roi, mais l'expérience utilisateur est reine. Découvrez comment implémenter une barre de progression, un sommaire et un bouton de copie sur votre blog Astro."
pubDate: "2026-03-09"
image: "../../../assets/astro-ux-micro-features.png"
imageAlt: "Une loupe géante mettant en évidence trois petits rouages dorés sur une interface web, symbolisant les détails de l'UX. Image générée par IA."
imageCaption: "Le diable (et l'UX) se cache dans les détails. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "UX", "JavaScript", "UI", "Tutoriel"]
translation: "micro-features-reading-ux"
---

Sur un blog technique, on passe beaucoup de temps à peaufiner notre contenu, notre SEO et notre architecture. Mais qu'en est-il de nos lecteurs ? Sont-ils dans les meilleures conditions pour consommer nos longs tutoriels ?

L'Expérience Utilisateur (UX) ne se résume pas à de grandes animations. Elle réside souvent dans les micro-interactions. Aujourd'hui, je vous partage 3 fonctionnalités faciles à implémenter sur votre site Astro pour transformer la lecture en un véritable plaisir.

## 1. La barre de progression de lecture

Quand on s'attaque à un article de 2000 mots, il est rassurant de savoir où l'on en est. Une discrète barre de progression fixée en haut de l'écran est un excellent indicateur visuel.

**L'implémentation :**
Un simple `<div>` vide et un soupçon de JavaScript suffisent.

```astro
<div id="reading-progress" class="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-150" style="width: 0%;"></div>

<script>
  function initProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      // Hauteur totale défilable = Hauteur du document - Hauteur de la fenêtre
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      
      const progress = (scrolled / scrollableHeight) * 100;
      progressBar.style.width = `${progress}%`;
    });
  }

  // Compatible avec les View Transitions !
  document.addEventListener('astro:page-load', initProgressBar);
</script>
```

## 2. La Table des Matières (TOC) dynamique

Si votre article est un guide, laissez vos lecteurs sauter directement à la section qui les intéresse. L'avantage avec Astro, c'est que l'extraction des titres Markdown est native.

### L'implémentation

Lors du rendu de votre contenu, Astro vous fournit une propriété `headings` que vous pouvez utiliser pour construire votre menu.

```astro
---
// Dans votre composant d'article
const { post } = Astro.props;
const { Content, headings } = await post.render();

// On ne garde que les H2 et H3 pour ne pas surcharger
const toc = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
---

<aside class="toc-container">
  <h3>Sommaire</h3>
  <ul>
    {toc.map((heading) => (
      <li class={`depth-${heading.depth}`}>
        <a href={`#${heading.slug}`}>{heading.text}</a>
      </li>
    ))}
  </ul>
</aside>

<Content />
```

## 3. Le bouton "Copier le code"

C'est LA fonctionnalité indispensable pour tout blog de développeur. Forcer vos lecteurs à sélectionner manuellement des lignes de code sur mobile est une torture. Offrez-leur un bouton "Copier" !

### L'implémentation

Astro transforme vos blocs Markdown en balises `<pre><code>`. Nous allons injecter dynamiquement un bouton dans chaque balise `<pre>` avec JavaScript.

``` javascript
<script>
  function initCopyButtons() {
    const blocks = document.querySelectorAll('pre');

    blocks.forEach((block) => {
      // On évite de dupliquer si le bouton existe déjà
      if (block.querySelector('.copy-btn')) return;

      // Création du bouton
      const button = document.createElement('button');
      button.className = 'copy-btn absolute top-2 right-2 p-1 text-xs bg-gray-800 text-white rounded';
      button.innerText = 'Copier';

      // Positionnement relatif nécessaire sur le parent
      block.style.position = 'relative';
      block.appendChild(button);

      button.addEventListener('click', async () => {
        const code = block.querySelector('code')?.innerText;
        if (code) {
          await navigator.clipboard.writeText(code);
          button.innerText = 'Copié !';
          setTimeout(() => { button.innerText = 'Copier'; }, 2000);
        }
      });
    });
  }

  document.addEventListener('astro:page-load', initCopyButtons);
</script>
```

## Conclusion

En moins de 100 lignes de code cumulées, nous venons d'ajouter trois fonctionnalités qui améliorent considérablement le confort de lecture. N'oubliez jamais : sur le web, la technique doit toujours être au service de l'utilisateur.

Avez-vous d'autres micro-fonctionnalités que vous aimez retrouver sur les blogs techniques ?
