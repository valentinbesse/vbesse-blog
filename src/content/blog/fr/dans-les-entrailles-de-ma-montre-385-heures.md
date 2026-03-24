---
title: "Dans les entrailles de ma montre : 385 heures de sport et une blessure décryptées par la data"
description: "Plongée technique dans mes données Garmin et Polar H10 : la preuve des 80/20, l'évolution de l'efficacité aérobie, et la surcharge qui a mené à ma tendinopathie."
pubDate: "2026-03-24"
image: "../../../assets/chart_2_training_load.png"
imageAlt: "Graphique en barres montrant l'évolution de la charge d'entraînement kilométrique avec un pic de surcharge rouge en mars 2026."
imageCaption: "La data ne ment jamais : l'erreur de charge de mars 2026."
aiDisclaimer: "Données extraites, nettoyées et analysées via l'IA avec Python."
tags: ["Running", "Data", "Python", "Garmin", "Blessure"]
translation: "deep-dive-garmin-data-385-hours-sports"
---

Dans mon précédent article, je vous racontais l'histoire de cette année de préparation au semi-marathon de Nancy et ma blessure de dernière minute. Aujourd'hui, on enlève l'émotion, et on ne regarde plus que les froides mathématiques. 

J'ai exporté la totalité de mes activités de ma montre Garmin (couplée à ma ceinture Polar H10) dans un fichier brut. L'analyse révèle exactement pourquoi j'ai autant progressé, mais aussi pourquoi j'ai fini par exploser.

Voici 5 graphiques qui résument presque 400 heures de sueur.

## 1. La fondation du temple : La règle des 80/20

On entend souvent dire qu'il faut courir lentement pour courir vite. C'est la fameuse règle de l'endurance fondamentale. 

![Répartition des zones cardiaques 80/20](../../../assets/chart_1_80_20.png)

Avec une fréquence cardiaque au repos de 46 BPM et une maximale mesurée à 196 BPM (méthode de Karvonen), ma "Zone 2" s'étend jusqu'à 152 BPM. Le graphique ci-dessus est sans appel : **96,7 % de mon temps de course** a été passé dans cette zone verte. J'ai construit un énorme moteur diesel sans générer de fatigue lactique inutile.

## 2. La preuve de la progression : L'efficacité aérobie

Augmenter sa VO2Max de 40 à 44, c'est un chiffre abstrait. Mais que se passe-t-il concrètement sur le terrain ?

![Graphique de l'efficacité aérobie](../../../assets/chart_4_efficiency.png)

Ce nuage de points compare toutes mes sorties entre le début de ma préparation (en gris) et la fin de ma préparation (en bleu). On y lit la définition pure du progrès aérobie : **pour une même fréquence cardiaque (ex: 140 BPM), ma vitesse de course a drastiquement augmenté**. Le nuage bleu est décalé vers le haut (allures plus rapides) par rapport au nuage gris, prouvant que mon cœur est devenu beaucoup plus efficient pour envoyer de l'oxygène aux muscles.

## 3. L'arme à double tranchant : Course VS Entraînement croisé

Beaucoup de coureurs pensent que seul le kilométrage compte. L'analyse de mon volume total révèle une autre réalité : j'étais un acharné du "Cross-Training" (à la salle *[Le Punch](https://punchnancy.fr/)*).

![Graphique course vs entraînement croisé](../../../assets/chart_3_cross_training.png)

Sur un an, j'ai couru environ **177 heures**... mais j'ai aussi passé **208 heures** à faire du renforcement, du fitness et du cardio pur ! Soit un total effarant de plus de 385 heures de sport.
Ce volume massif m'a construit une véritable armure musculaire protectrice, mais c'est aussi lui qui a puisé dans mon énergie nerveuse et ma capacité de récupération sans que je m'en rende compte.

## 4. Chronique d'une blessure annoncée : La charge kilométrique

Nous arrivons au graphique le plus douloureux : celui de l'erreur.

![Évolution de la charge d'entraînement](../../../assets/chart_2_training_load.png)

En bleu, la lente et prudente augmentation de mon kilométrage au fil des mois, orchestrée par mon coach. En rouge, le mois de mars 2026.
C'est facile de refaire le match après coup.
Je pense que ce qui a causé ma blessure est un mélange entre :

* augmentation du volume par sortie
* augmentation de l'allure
* changement de chaussure pour une paires plus performantes

Le tendon de mon tibial postérieur a dit stop. La mécanique a lâché.

## 5. Les "Fun Datas" pour relativiser

Pour finir sur une note plus légère, j'ai compilé les totaux absurdes de mon année sportive. Depuis mai 2025, j'ai :
* 🔥 **Brûlé plus de 247 000 kilocalories.** C'est l'équivalent énergétique d'environ **120 pizzas entières** (ou 1200 pintes de bière pour l'hydratation post-course !).
* 🏔️ **Gravi 10 654 mètres de dénivelé positif.** C'est bien plus haut que le sommet du Mont Everest (8 848m), ou l'équivalent de 32 fois l'ascension de la Tour Eiffel par les escaliers.

L'analyse de ces données est thérapeutique. L'erreur de charge est évidente mathématiquement, ce qui prouve qu'elle est évitable à l'avenir. Mon moteur est gigantesque et prêt pour la suite. 

On sauvegarde le fichier CSV. Et on repart pour l'édition 2027.