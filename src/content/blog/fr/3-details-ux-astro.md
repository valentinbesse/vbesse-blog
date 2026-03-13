---
title: "3 détails UX qui font la différence sur un blog Astro"
description: "Comment j'ai peaufiné l'expérience utilisateur de mon blog bilingue avec une redirection intelligente, un menu mobile 'click-away' et des icônes dynamiques."
pubDate: "2026-03-13"
image: "../../../assets/astro-ux-details.png"
imageAlt: "Schéma d'une interface utilisateur montrant la redirection linguistique et les interactions du menu mobile. Image générée par IA."
imageCaption: "L'expérience utilisateur se cache toujours dans les petits détails."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "UX", "JavaScript", "CSS", "i18n"]
translation: "3-ux-details-astro-blog"
---

Après avoir [rendu mon blog bilingue](/blog/astro-i18n) en domptant les View Transitions d'Astro, je pensais avoir fait le plus dur. Mais comme souvent dans le développement web, le diable (et la qualité) se cache dans les détails.

Mon ami **[Cristian Fernández Del Pozo](https://www.linkedin.com/in/cferndp/)**, toujours à l'affût d'une bonne amélioration, m'a soumis trois excellentes idées pour faire passer l'UX (Expérience Utilisateur) du blog au niveau supérieur.

Voici comment j'ai implémenté ces trois "micro-fonctionnalités" qui font toute la différence.

## 1. La redirection linguistique (intelligente)

**Le problème :** Mon site propose du français et de l'anglais. Mais si un développeur de New York tape `vbesse.com`, il atterrit par défaut sur la version française. Pas idéal.

**La solution naïve :** Rediriger tout le monde en fonction de la langue du navigateur (`navigator.language`).  
**Le danger :** Si je partage un lien direct vers un article en français à un collègue espagnol, il serait redirigé de force vers l'accueil en anglais. Frustrant !

**Ma solution (L'approche douce) :** Je n'effectue la vérification **que** sur la racine stricte du site (`/`). J'ai donc ajouté un script "inline" tout en haut de mon fichier `index.astro` pour qu'il s'exécute instantanément, avant même l'affichage de la page :

```astro
<script is:inline>
  if (window.location.pathname === '/') {
    const savedLang = localStorage.getItem('preferred_lang');
    
    if (savedLang === 'en') {
      window.location.replace('/en/');
    } else if (!savedLang) {
      const browserLang = navigator.language || navigator.userLanguage;
      if (!browserLang.toLowerCase().startsWith('fr')) {
        window.location.replace('/en/');
      }
    }
  }
</script>
```

Pour que cela soit parfait, j'écoute également les clics sur mon sélecteur de langue dans le menu pour sauvegarder le choix de l'utilisateur dans son `localStorage`. S'il choisit manuellement le français, je ne le forcerai plus jamais à passer en anglais !

## 2. Le menu mobile "Click-Away"

**Le problème :** Sur mobile, quand on ouvre le menu hamburger, il prend toute la place. L'utilisateur lit un lien, clique à côté pour fermer le menu... et rien ne se passe. Il faut cibler exactement la petite croix pour le fermer.

**La solution :** Écouter les clics sur l'ensemble du document et vérifier si la cible du clic se trouve en dehors du conteneur du menu. Avec Astro et le `ClientRouter` (View Transitions), il faut faire attention à ne pas multiplier les écouteurs d'événements à chaque changement de page.

Dans mon composant `<Header />`, j'ai attaché cette logique à l'événement `astro:page-load` :

```javascript
const closeMenuOnClickOutside = (event) => {
    const target = event.target;
    // Si le menu est ouvert ET qu'on ne clique pas dessus
    if (
        navLinksContainer?.classList.contains("expanded") &&
        !navLinksContainer.contains(target) &&
        !newMenuToggle.contains(target)
    ) {
        // On ferme le menu
        newMenuToggle.setAttribute("aria-expanded", "false");
        navLinksContainer.classList.remove("expanded");
        newMenuToggle.classList.remove("open");
    }
};

// On nettoie l'ancien écouteur avant d'en remettre un neuf (merci le ClientRouter !)
document.removeEventListener("click", closeMenuOnClickOutside);
document.addEventListener("click", closeMenuOnClickOutside);
```

## 3. Des icônes de menu toujours visibles

**Le problème :** Avec le passage au Dark Mode ou des fonds qui changent, les icônes SVG de mon menu (le hamburger et la croix) pouvaient parfois manquer de contraste.

**La solution :** Garder les choses simples avec les variables CSS. J'ai ajouté une variable globale `--kebab-menu-color` dans mon fichier `global.css`.

Ensuite, une petite modification dans le style du `<Header />` permet d'appliquer cette couleur dynamiquement, uniquement sur mobile :

``` css
@media (max-width: 768px) {
    #menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--kebab-menu-color, #ffffff); 
    }
    
    #menu-toggle svg {
       stroke: currentColor;
    }
}
```

Grâce à `currentColor`, le SVG hérite automatiquement de la couleur de son parent. Si je change l'ambiance de mon site demain, je n'aurai qu'une seule variable CSS à modifier !

Conclusion
Ce sont ces petits détails qui transforment un simple site statique en une véritable application web agréable à parcourir. N'hésitez jamais à écouter les retours de vos utilisateurs (ou de vos amis développeurs pointilleux !).

Et vous, quelle est la petite fonctionnalité UX dont vous ne pouvez plus vous passer sur un site ?
