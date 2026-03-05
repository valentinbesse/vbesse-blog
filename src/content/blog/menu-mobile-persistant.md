---
title: "Astro ClientRouter : Le piège du Menu Mobile persistant"
description: "Vous venez d'activer les View Transitions sur Astro, mais votre menu hamburger fait n'importe quoi ? Découvrez pourquoi et comment corriger le cycle de vie de votre JavaScript."
pubDate: "2026-03-05"
image: "../../assets/astro-mobile-menu-bug.png"
imageAlt: "Un smartphone affichant un menu de navigation emmêlé dans des toiles d'araignées numériques, symbolisant un script bloqué. Image générée par IA."
imageCaption: "Ne laissez pas votre menu mobile se transformer en piège. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "JavaScript", "UX", "Debugging", "ClientRouter"]
---

Dans mon précédent article, nous avons vu comment transformer un site statique Astro en une Single Page Application (SPA) ultra-fluide grâce à une simple ligne de code : `<ClientRouter />`.

L'effet "Wahou" est immédiat. Vos pages s'enchaînent avec des transitions douces, c'est magnifique. Puis, vous testez votre site sur mobile... et c'est le drame.

Vous ouvrez votre menu hamburger, vous cliquez sur un lien. La nouvelle page se charge en arrière-plan, la transition s'opère, mais **votre menu mobile reste grand ouvert en plein milieu de l'écran**. Pire encore : si vous le fermez et essayez de l'ouvrir à nouveau, le bouton ne répond plus !

Que s'est-il passé ? Bienvenue dans le monde merveilleux du cycle de vie des View Transitions.

## Pourquoi votre menu est-il cassé ?

Pour comprendre le bug, il faut comprendre comment fonctionne le `<ClientRouter />` d'Astro.

Lors d'une navigation classique (MPA), le navigateur détruit l'ancienne page, télécharge la nouvelle, et exécute votre JavaScript de zéro. L'événement `DOMContentLoaded` se déclenche, et votre script attache gentiment un `addEventListener` à votre bouton de menu.

Avec le `ClientRouter`, **il n'y a plus de rechargement complet**. Astro intercepte le clic, récupère le nouveau HTML, et remplace (swap) uniquement le contenu de la balise `<body>`.

Cela crée deux problèmes majeurs pour notre menu mobile :

1. **La perte des écouteurs d'événements :** L'ancien bouton hamburger a été détruit et remplacé par un nouveau. Mais votre script, qui ne s'est exécuté qu'au premier chargement, écoute toujours le "fantôme" de l'ancien bouton.
2. **La persistance de l'état (CSS) :** Si votre menu s'ouvre en ajoutant une classe `.menu-open` sur le `<body>`, cette classe ne disparaît pas magiquement lors de la transition. Le nouveau contenu arrive, mais le body garde l'ordre de rester ouvert !

## La solution : S'adapter au nouveau cycle de vie

Astro a prévu le coup et met à disposition des événements personnalisés pour remplacer nos vieux réflexes.

### Étape 1 : Remplacer DOMContentLoaded

Oubliez `DOMContentLoaded`. Pour que votre script s'exécute à la fois lors du premier chargement *et* après chaque navigation fluide, vous devez utiliser l'événement `astro:page-load`.

```javascript
// ❌ L'ancienne méthode (ne marche qu'une fois)
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
});

// ✅ La méthode Astro (s'exécute à chaque changement de page)
document.addEventListener('astro:page-load', () => {
  initMenu();
});
```

### Étape 2 : Le script complet et robuste

Maintenant que nous savons quand exécuter notre code, il faut s'assurer qu'il fait deux choses : attacher l'événement au nouveau bouton, et forcer la fermeture du menu par défaut.

Voici un exemple de script de menu mobile (Vanilla JS) parfaitement adapté pour le `ClientRouter` :

``` html
<script>
  function initMobileMenu() {
    // 1. On récupère les éléments du DOM fraîchement injectés
    const burgerBtn = document.getElementById('burger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    // 2. On sécurise : si les éléments n'existent pas sur cette page, on arrête
    if (!burgerBtn || !mobileNav) return;

    // 3. On force la fermeture par défaut (règle le bug du menu persistant)
    document.body.classList.remove('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');

    // 4. On (ré)attache l'événement de clic au bouton
    // Note: On utilise une fonction fléchée propre pour éviter 
    // d'empiler les écouteurs si la logique se complexifie.
    burgerBtn.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('menu-open');
      
      if (isOpen) {
        document.body.classList.remove('menu-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      } else {
        document.body.classList.add('menu-open');
        burgerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // L'événement magique d'Astro
  document.addEventListener('astro:page-load', initMobileMenu);
</script>
```

## L'astuce bonus : fermer au clic sur un lien

Même avec ce correctif, il reste un petit détail UX. Si l'utilisateur clique sur un lien à l'intérieur de votre menu mobile, la page va transitionner, le menu va se réinitialiser (grâce à notre étape 3)... mais parfois la transition peut paraître saccadée si le menu reste ouvert pendant l'animation de changement de page.

Vous pouvez utiliser un autre événement Astro, `astro:before-preparation` (qui se déclenche dès le clic sur le lien, avant même de chercher la nouvelle page), pour forcer la fermeture immédiate du menu, offrant une transition encore plus fluide.

``` js
document.addEventListener('astro:before-preparation', () => {
  document.body.classList.remove('menu-open');
});
```

En maîtrisant ces événements (`astro:page-load` et `astro:before-preparation`), vous avez désormais toutes les clés en main pour dompter le `<ClientRouter />` et offrir à vos utilisateurs une navigation sans faille !
