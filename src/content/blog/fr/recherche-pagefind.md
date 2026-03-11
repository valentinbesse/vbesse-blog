---
title: "Cmd+K pour tous : Intégrer une recherche instantanée avec Pagefind"
description: "Offrez à vos utilisateurs une expérience de navigation premium avec une barre de recherche globale Cmd+K sur votre site statique Astro, propulsée par Pagefind."
pubDate: "2026-03-10"
image: "../../../assets/astro-pagefind-cmdk.png"
imageAlt: "Un clavier d'ordinateur lumineux avec les touches Cmd et K en surbrillance, générant un rayon de lumière vers une barre de recherche. Image générée par IA."
imageCaption: "La recherche instantanée, la touche premium de votre blog. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "UX", "Pagefind", "JavaScript", "Recherche"]
translation: "instant-search-pagefind-cmdk"
---

Si vous utilisez des outils comme Raycast, Slack, ou que vous naviguez souvent sur les documentations de Vercel ou Tailwind, vous avez sûrement développé un réflexe : **Cmd+K** (ou Ctrl+K sous Windows).

Ce raccourci clavier ouvre une "Command Palette" (ou barre de recherche globale) flottante qui permet de trouver instantanément ce que l'on cherche sans toucher à sa souris. C'est devenu le standard absolu de l'expérience utilisateur moderne.

Pourtant, implémenter une vraie recherche textuelle sur un site statique généré par Astro (sans base de données ni backend) a longtemps été un casse-tête. Heureusement, **Pagefind** a changé la donne.

## Qu'est-ce que Pagefind ?

[Pagefind](https://pagefind.app/) est une bibliothèque de recherche développée en Rust, spécialement conçue pour les sites statiques.

Contrairement aux anciennes méthodes qui obligeaient le navigateur du visiteur à télécharger un énorme fichier `index.json` pour chercher un mot, Pagefind génère une multitude de minuscules fragments lors du "build" de votre site. Le navigateur ne télécharge que les quelques kilo-octets nécessaires à sa recherche. C'est magique, gratuit, et ça ne nécessite ni Algolia, ni serveur.

## Étape 1 : Préparer la compilation

Pagefind fonctionne en scannant vos fichiers HTML **après** qu'Astro les a générés.
La première étape consiste donc à modifier votre fichier `package.json` pour lancer Pagefind juste après le build d'Astro.

```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npx pagefind --site dist",
    "preview": "astro preview"
  }
}
```

*Note : Remplacez dist par votre dossier de sortie si vous l'avez modifié.*

## Étape 2 : Créer la Modal (Boîte de dialogue)

Nous allons utiliser la balise native HTML `<dialog>`. Elle est parfaite pour ça : elle gère automatiquement l'affichage au-dessus du reste du site, le fond grisé (backdrop), et la touche `Échap` pour fermer.

Créons un composant `SearchModal.astro` :

```astro
---
// src/components/SearchModal.astro
---

<dialog id="search-dialog" class="backdrop:bg-black/50 p-4 rounded-lg shadow-xl w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
  
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold">Recherche</h2>
    <button id="close-dialog" class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Échap</button>
  </div>

  <div id="search"></div>

</dialog>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
```

## Étape 3 : La magie du raccourci Cmd+K

C'est ici que l'on donne vie à notre palette de commande. Nous devons écouter les touches du clavier, afficher la modal, et initialiser Pagefind.

Toujours dans notre fichier `SearchModal.astro`, ajoutons le script suivant. Si vous avez suivi mes précédents tutoriels, vous remarquerez l'utilisation de `astro:page-load` pour garantir le fonctionnement avec les View Transitions (`ClientRouter`) !

``` javascript
<script>
  function initSearch() {
    const dialog = document.getElementById('search-dialog') as HTMLDialogElement;
    const closeBtn = document.getElementById('close-dialog');

    if (!dialog) return;

    // 1. Initialiser Pagefind UI
    // On s'assure qu'il n'est pas déjà initialisé pour éviter les doublons
    if (!document.querySelector('.pagefind-ui__search-input')) {
      // @ts-ignore - PagefindUI est injecté globalement par le script
      new window.PagefindUI({ element: "#search", showSubResults: true });
    }

    // 2. Gérer le raccourci clavier (Cmd+K ou Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Empêche le comportement par défaut du navigateur
        dialog.showModal();
        
        // Focus automatique sur le champ de recherche Pagefind
        setTimeout(() => {
          document.querySelector<HTMLInputElement>('.pagefind-ui__search-input')?.focus();
        }, 50);
      }
    });

    // 3. Fermer la modal au clic sur le bouton "Échap"
    closeBtn?.addEventListener('click', () => {
      dialog.close();
    });

    // 4. Fermer la modal si on clique en dehors
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialog.close();
      }
    });
  }

  // Compatible avec les View Transitions !
  document.addEventListener('astro:page-load', () => {
    // Le script de Pagefind n'est disponible qu'après le build
    // On l'ajoute dynamiquement
    const script = document.createElement('script');
    script.src = "/pagefind/pagefind-ui.js";
    script.onload = initSearch;
    document.head.appendChild(script);
  });
</script>
```

## Étape 4 : L'intégration finale

Il ne vous reste plus qu'à importer `<SearchModal />` à la racine de votre Layout principal (par exemple dans `BaseLayout.astro`) pour que la recherche soit disponible sur toutes vos pages.

Lancez `npm run build` puis servez le dossier `dist`, et appuyez sur Cmd+K... Profitez de votre nouvelle barre de recherche instantanée !

*Petite astuce : N'hésitez pas à écraser les variables CSS de Pagefind (comme `--pagefind-ui-primary`) dans votre feuille de style globale pour que la barre de recherche matche parfaitement avec le thème et le Dark Mode de votre blog.*
