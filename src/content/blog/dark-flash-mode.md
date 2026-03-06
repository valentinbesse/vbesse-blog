---
title: "Dark Mode sans flash : L'implémentation parfaite avec Astro et CSS Variables"
description: "Marre de brûler la rétine de vos visiteurs avec un flash blanc au chargement ? Découvrez comment créer un Dark Mode parfait et persistant avec Astro."
pubDate: "2026-03-06"
image: "../../assets/astro-dark-mode-flash.png"
imageAlt: "Une lune et un soleil divisant un écran d'ordinateur, avec un bouclier bloquant un rayon de lumière intense, symbolisant la protection contre le flash blanc. Image générée par IA."
imageCaption: "Protéger les rétines de vos utilisateurs, une ligne de code à la fois. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "CSS", "UI", "JavaScript", "Accessibilité"]
---

Nous avons tous vécu cette situation : vous naviguez tranquillement à 2h du matin sur un site en mode sombre, vous cliquez sur un lien, et là... **BAM !** Un écran totalement blanc vous explose la rétine pendant une demi-seconde avant que le mode sombre ne se réactive.

Ce phénomène porte un nom : le **FOUC** (*Flash of Unstyled Content*).

Il se produit lorsque votre JavaScript, responsable d'appliquer le thème sombre, s'exécute *après* que le navigateur a commencé à peindre la page à l'écran.

Aujourd'hui, nous allons voir comment implémenter un Dark Mode robuste dans Astro, basé sur des variables CSS, et surtout : comment bloquer ce maudit flash de lumière.

## 1. La fondation : Les Variables CSS

Avant de manipuler du JavaScript, il faut préparer notre CSS. La méthode la plus propre consiste à utiliser des variables CSS attachées à la racine de notre document (`:root`) et de les modifier lorsqu'une classe `.dark` est ajoutée à la balise `<html>`.

```css
/* src/styles/global.css */

/* Thème Clair (Par défaut) */
:root {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --primary-color: #3b82f6;
}

/* Thème Sombre (Actif quand <html> a la classe 'dark') */
:root.dark {
  --bg-color: #121212;
  --text-color: #e5e5e5;
  --primary-color: #60a5fa;
}

/* Application globale */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## 2. Le secret anti-flash : Le script bloquant

C'est ici que se joue la guerre contre le flash blanc. Dans un framework classique (comme React), on se bat souvent avec le Server-Side Rendering (SSR) pour injecter le thème.

Dans Astro, c'est beaucoup plus simple. Il suffit d'ajouter un petit script inline directement dans notre composant `<BaseHead />` (celui qui génère la balise `<head>)`.

L'attribut `is:inline` est crucial : il dit à Astro de ne pas différer (defer) ce script. Le navigateur va le lire et l'exécuter avant même de commencer à dessiner le `<body>`.

``` astro
---
// src/components/BaseHead.astro
---
<head>
  <script is:inline>
    const theme = (() => {
      // 1. On regarde s'il y a un thème sauvegardé dans le localStorage
      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
      }
      // 2. Sinon, on regarde les préférences du système d'exploitation
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      // 3. Par défaut, on renvoie 'light'
      return 'light';
    })();

    // On applique la classe immédiatement, avant le rendu du <body> !
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // On sauvegarde la préférence pour s'assurer de sa disponibilité
    window.localStorage.setItem('theme', theme);
  </script>
</head>
```

Et voilà, le flash est mort. Le navigateur sait s'il doit peindre un fond noir ou blanc avant même de commencer.

## 3. Le bouton "Toggle" (Le piège du ClientRouter)

Maintenant que notre fondation est solide, il nous faut un bouton pour laisser l'utilisateur choisir son camp.

Créons un composant `ThemeToggle.astro`. Si vous avez suivi mon article d'hier sur le `ClientRouter` (View Transitions), vous savez déjà qu'un simple `addEventListener('click')` ne survivra pas à la navigation. Il faut utiliser les événements natifs d'Astro !

``` astro
---
// src/components/ThemeToggle.astro
---
<button id="theme-toggle" aria-label="Changer de thème">
  🌓 Changer de thème
</button>

<script>
  function setupThemeToggle() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    button.addEventListener('click', () => {
      // On bascule la classe sur la balise <html>
      const isDark = document.documentElement.classList.toggle('dark');
      
      // On sauvegarde le choix de l'utilisateur
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // S'exécute au chargement initial ET après chaque navigation (View Transitions)
  document.addEventListener('astro:page-load', setupThemeToggle);
</script>
```

## 4. Gérer les View Transitions : L'événement ultime

Si vous utilisez le `ClientRouter` (ce que je vous recommande chaudement), il reste un dernier détail. Lors d'un changement de page, Astro remplace le `document.documentElement` complet. Cela signifie que la classe `.dark` que nous avons laborieusement calculée peut "sauter" pendant la transition entre deux pages, recréant un flash !

Pour éviter ça, il faut dire à Astro de réappliquer le thème juste après avoir remplacé le contenu de la page, mais avant de l'afficher. C'est le rôle de l'événement `astro:after-swap`.

Ajoutez simplement ceci dans le `<script>` de votre `<BaseHead />` (à la suite du script inline que nous avons vu à l'étape 2) :

``` javascript
// A rajouter dans votre BaseHead.astro, en dessous du script is:inline
document.addEventListener('astro:after-swap', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
```

## Conclusion

En combinant un petit script synchrone dans le `<head>`, des variables CSS bien pensées, et en respectant le cycle de vie des View Transitions d'Astro, vous obtenez un Dark Mode résilient, accessible (qui respecte les préférences de l'OS), et surtout... qui ne rendra pas vos utilisateurs aveugles à la nuit tombée !
