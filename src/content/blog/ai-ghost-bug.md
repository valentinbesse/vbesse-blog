---
title: "Quand l'IA éteint la lumière : Autopsie d'un bug génératif fantôme"
description: "J'ai demandé à une IA d'agrandir mon logo. Le résultat ? Une image presque noire. Retour sur un raté spectaculaire pour comprendre comment pensent les modèles génératifs."
pubDate: "2026-02-14"
image: "../../assets/ai-ghost-bug-cover.png"
imageAlt: "Un montage montrant à gauche le logo coloré Aumbox et à droite le résultat buggé, une image presque totalement noire où l'on devine à peine le logo."
imageCaption: "À gauche : ce que je voulais. À droite : ce que j'ai eu."
aiDisclaimer: "Article écrit avec l'aide de l'IA (qui s'est excusée pour le bug)."
---

On s'habitue vite à la magie. Depuis que j'utilise l'IA générative pour illustrer ce blog, je suis souvent bluffé par la qualité et la pertinence des résultats. On tape quelques mots, et pouf : une illustration isométrique complexe apparaît.

Mais parfois, la magie déraille. Et quand elle déraille, elle ne fait pas semblant.

Récemment, j'ai vécu une petite mésaventure qui illustre parfaitement le fossé qui existe encore entre notre compréhension humaine et la "compréhension" statistique d'une IA. Voici l'histoire du jour où mon logo est devenu un fantôme.

## La demande : simple, basique

Tout commence avec le logo de mon projet "Aumbox". J'avais une excellente version générée précédemment : le symbole "Om" orange vif, sortant dynamiquement d'une boîte bleue, le tout sur un fond sombre élégant.

<figure>
    <img src="../../assets/aumbox-logo-correct.png" alt="Le logo Aumbox correct avec ses couleurs vives" style="width: 50%; margin: auto; display: block;">
    <figcaption>Le logo original : coloré, lumineux, parfait.</figcaption>
</figure>

De l'autre côté, j'ai écris un article à propos de mon pipeline d'optimisation d'images pour ce blog. Je voulais illustrer cet article avec une image du pipeline. Je fais donc la demande la plus simple du monde à l'IA :

<figure>
    <img src="../../assets/pipeline-images.png" alt="Un schéma technique montrant une image brute entrant dans un entonnoir 'Astro Assets' et en ressortant optimisée en WebP sur différents écrans." style="width: 50%; margin: auto; display: block;">
    <figcaption>Une illustration du pipeline d'optimisation d'images.</figcaption>
</figure>

Voulant l'utiliser pour une illustration plus grande, je fais la demande la plus banale du monde à l'IA :

> "Génère l'image en taille réelle."

Je m'attendais à la même image, juste plus grande. Logique, non ?

## Le résultat : le néant

L'IA réfléchit quelques secondes et me livre... ceci :

<figure>
    <img src="../../assets/aumbox-logo-ghost.png" alt="Le résultat buggé : une image presque totalement noire" style="width: 50%; margin: auto; display: block; border: 1px solid #333;">
    <figcaption>Le résultat : "J'ai éteint la lumière, chef."</figcaption>
</figure>

Si vous êtes sur mobile ou dans une pièce lumineuse, vous voyez probablement un carré noir. Mais si vous augmentez la luminosité au maximum et plissez les yeux dans le noir complet, vous verrez... une forme fantomatique. C'est le logo, mais il a été vidé de toute sa lumière et de ses couleurs.

Rien à voir avec l'image pour l'article

Comment est-ce possible ? Comment une IA capable de dessiner des villes futuristes complexes peut-elle échouer sur une simple demande ?

## Comprendre le bug : L'IA ne "voit" pas

Cet échec est fascinant car il nous rappelle ce qu'est réellement une IA générative. Elle ne "comprend" pas le concept de "logo", de "lumière" ou de "agrandir". Elle manipule des probabilités mathématiques basées sur des tokens (des bouts de mots) et des pixels.

Voici les trois théories principales sur ce qui s'est passé dans le "cerveau" du modèle :

### 1. Le syndrome de l'"ambiance générale"

L'image originale a un fond très sombre. En recevant la demande de générer l'image en "taille réelle", l'IA a peut-être sur-interprété cette caractéristique.

Elle n'a pas réussi à dissocier le *sujet* (le logo lumineux) de son *environnement* (le fond noir). Pour elle, "l'ambiance" de l'image était "l'obscurité". Elle a donc appliqué cette règle de manière zélée à l'ensemble de l'image, éteignant le sujet principal au passage. C'est une erreur d'interprétation du contexte global.

### 2. Le "hoquet" contextuel (Perte d'information)

Dans une conversation suivie, l'IA doit garder en mémoire le contexte précédent. Parfois, entre deux étapes, des informations passent à la trappe.

Ici, l'IA a clairement confondu le contexte de mon illustration avec celui du logo. Mais en plus, elle a gardé la *forme* (le symbole Om et la boîte sont là), mais elle a "oublié" les attributs de couleur (orange, bleu) et de luminosité. Elle a généré la structure par défaut, sans les textures. C'est un peu comme si un peintre oubliait de mettre de la peinture sur sa toile après avoir fait le croquis.

### 3. Le caprice statistique

Enfin, il ne faut jamais oublier que ces modèles sont probabilistes. Il existe toujours une chance infime que le processus de génération prenne un mauvais chemin numérique. C'est l'équivalent d'un dé qui tomberait sur la tranche. C'est rare, mais ça arrive.

## La leçon : Soyez explicites

La leçon de cette histoire est simple : **ne jamais supposer que l'IA comprend l'implicite.**

Pour un humain, "agrandir l'image" implique évidemment "en gardant les couleurs et la lumière". Pour une IA, ce n'est pas évident.

Pour corriger le tir, il ne faut pas juste relancer la même commande. Il faut être directif et rajouter les informations perdues dans le prompt. Au lieu de "Génère l'image en taille réelle", le prompt correctif devient :

> "Génère moi l'image pour illustrer l'article ""Fini les images de 10 Mo : Mon pipeline d'optimisation automatique avec Astro" :
> * **Concept :** Un entonnoir futuriste ou une machine industrielle propre. D'un côté, on voit entrer des blocs lourds, bruts et désordonnés (les images "Raw"). De l'autre, il en ressort des diamants ou des blocs polis, légers et brillants (le WebP optimisé).
> * **Prompt suggéré si tu veux la générer :** *"Isometric 3D illustration of a digital factory funnel processing raw heavy image files into lightweight optimized futuristic glowing data blocks, dark blue background, tech style, cyber blue lighting."*
> 
>Je veux l'image en taille réelle."

L'IA est un outil surpuissant, mais elle a parfois besoin qu'on lui tienne la main... et qu'on lui rappelle d'allumer la lumière.
