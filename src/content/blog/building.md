---
title: "De l'idée à la mise en ligne : La stack technique derrière ce blog"
description: "Pourquoi j'ai choisi Astro et Vercel plutôt que Hugo ou WordPress, et comment j'ai configuré ce site de A à Z."
pubDate: "2026-01-15"
image: "../../assets/architecture-conceptuelle.png"
imageCaption: "Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
---

C'est fait. **vbesse.com** est en ligne. 

Lancer son propre blog technique est souvent une tâche qu'on repousse. On se perd dans le choix des technologies, on hésite entre la simplicité de WordPress et la flexibilité du code sur mesure. Après avoir envisagé plusieurs solutions, j'ai finalement opté pour une stack moderne, performante et gratuite.

Voici le récit de la construction de ce site.

## 1. Le choix des armes : Astro vs Le reste du monde

Au départ, j'avais un nom de domaine et une idée vague. J'ai regardé du côté de **Hugo**, un générateur de site statique très populaire. C'est puissant, mais la courbe d'apprentissage du langage *Go templating* m'a semblé un peu raide pour démarrer vite.

J'ai analysé les alternatives actuelles :
* **Jekyll :** Le standard historique, mais qui commence à vieillir (Ruby).
* **Eleventy (11ty) :** Très flexible, mais demande beaucoup de configuration initiale.
* **Astro :** Le challenger qui monte.

### Pourquoi Astro a gagné ?
Astro a une philosophie qui m'a séduit : **"Zero JavaScript by default"**. Contrairement à des frameworks comme Next.js qui envoient beaucoup de code au navigateur, Astro génère du HTML pur. Résultat : le site est ultra-rapide.
De plus, l'architecture par composants (`.astro`) est intuitive et permet d'intégrer du Markdown nativement pour rédiger les articles.

## 2. L'hébergement : La puissance de Vercel

Pour héberger le site, je ne voulais pas gérer de serveur FTP ni payer un abonnement mensuel pour un projet personnel. J'ai hésité avec **GitHub Pages**, mais j'ai choisi **Vercel**.

**Les avantages sont immédiats :**
* **Déploiement Git :** Je pousse mon code sur GitHub, et Vercel met à jour le site automatiquement en 30 secondes.
* **Performance :** Le site est distribué sur un CDN mondial (Edge Network).
* **Coût :** C'est totalement gratuit pour un usage personnel.

## 3. La construction : Du code au design

Le développement s'est fait sur mon MacBook Pro, directement dans **Visual Studio Code**.

### L'architecture
J'ai opté pour une structure minimaliste :
* `src/layouts/Layout.astro` : Le squelette du site (En-tête, SEO, Pied de page).
* `src/pages/` : Les pages statiques (Accueil, À propos).
* `src/pages/blog/` : Mes articles en Markdown.

### Le Design (Sur mesure)
Plutôt que d'utiliser un thème tout fait, j'ai personnalisé le CSS pour avoir quelque chose de propre et lisible.
* **Police :** Utilisation de la stack système (San Francisco sur Mac) et de la police *Inter* pour un rendu net.
* **Couleurs :** Une palette sombre et claire (Dark/Light) avec une couleur d'accentuation "Bleu électrique" (`#0070f3`) pour dynamiser les liens.
* **Navigation :** Un menu en *Flexbox* qui sépare bien le logo des liens de navigation.

```css
/* Un exemple de la simplicité du CSS global */
:root {
  --accent-color: #0070f3;
  --text-color: #1a1a1a;
  --bg-color: #ffffff;

}
```

## 4. Le SEO : Ne pas être invisible

Un beau site ne sert à rien si personne ne le trouve. J'ai configuré le fichier Layout.astro pour qu'il gère dynamiquement :
1. Les balises Meta : Titre et description uniques pour chaque page.
2. Open Graph : Pour que les partages sur LinkedIn ou Twitter affichent une belle "Card" avec image.
3. Sitemap : Généré automatiquement pour Google.

## 5. Et maintenant ?
Ce blog est désormais mon terrain de jeu. Le flux de publication est idéal : j'écris en Markdown, je git push, et c'est en ligne.

Si vous lisez ceci, c'est que toute la chaîne fonctionne parfaitement. À bientôt pour de prochains articles techniques !