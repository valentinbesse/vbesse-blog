---
title: "Apprivoiser le Legacy : Transformer la dette en opportunité"
description: "Le code legacy n'est pas une fatalité. Stratégies, tests et refactoring : comment reprendre le contrôle d'un projet sans tout réécrire."
pubDate: "2026-02-15"
image: "../../assets/legacy-repair.png"
imageAlt: "Un horloger futuriste réparant avec précision un mécanisme ancien et complexe composé d'engrenages dorés et poussiéreux."
imageCaption: "Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA (Correction et mise en forme)."
tags: ["Legacy", "Refactoring", "Testing", "Craftsmanship"]
---

*Avant-propos : Cet article avait était écris lorsque je travaillais à [Davidson](https://www.davidson.fr/). Merci à [Jilly RUNDSTADLER](https://www.linkedin.com/in/jimmy-rundstadler/) et [Luc DEHAND](https://www.linkedin.com/in/luc-dehand/) pour leur relecture. Autre sujet, Je suis victime de mes propres limites et de mes biais. Je m’inscris dans le mouvement Software Craftsmanship et je suis coach Agile. Ma vision est influencée par ces notions. Je ne prétends pas rapporter ici la seule approche, ni même la meilleure. C’est juste la mienne.*

---

Si on demande à des développeuses et des développeurs ce qu'est un logiciel *legacy*, je suis prêt à parier que vous aurez autant de définitions que de personnes. Pourtant, si on met les mêmes personnes face à n’importe quel code source, la question est vite répondue. C’est ce code confus, spaghetti, avec des dizaines de générations de développeurs qui ont travaillé dessus.

Déjà, vous l’aurez remarqué, j’ai parlé de code source. Un logiciel legacy ne l’est pas par son fonctionnement ou ses performances. Il y a des logiciels legacy très performants et des logiciels non legacy qui sortent dans un état lamentable (pensée pour les équipes de Paradox lors de la sortie de *City Skylines 2*).

Dès à présent, on utilisera le terme de code legacy. Pour ma part, je reprends la définition de **Michael Feathers** :

> "Un code legacy est un code ne disposant pas de tests."

Il n’y a que les tests qui puissent garantir le fonctionnement du code. Sans test, il devient complexe d’agir sur le code sans introduire de régression.

La reprise d'un code legacy est alors un vrai défi. Pourtant, c’est un enjeu critique pour le business. On retrouve des applications majeures en legacy. Ce sont les projets qui ont souvent le plus de valeur, et donc ceux qui rapportent de l’argent. Impossible de s’en défaire, impossible de les débrancher, impossible de ne pas les maintenir ou de résister à ajouter de nouvelles fonctionnalités…

Alors que faire ? Il est temps de changer la donne. La reprise du legacy n’est pas une punition. C’est une opportunité.

## Il est urgent de ne rien faire

Lorsque l’on arrive sur un projet legacy, commençons par ne pas nous disperser. Il peut être tentant de tout réécrire. Le refactoring est souvent perçu comme une opération coûteuse et risquée. Alors, il vaut mieux observer et se focaliser sur son scope.

Déjà, quel est le périmètre :

* Doit-on reprendre l’ensemble du fonctionnement du logiciel ?
* Doit-on corriger des régressions sur un périmètre limité ?
* Doit-on ajouter une nouvelle fonctionnalité pour un nombre restreint d’utilisateurs ?

La première étape est de **restreindre son effort en délimitant le périmètre**.

Puis, on passe à l’analyse du code :

1. Compile-t-il ?
2. Existe-t-il des tests ? (unitaires, d’intégrations, de fonctionnement…)

À partir de là, vous devez avoir une idée de ce qu’il faut ajouter comme tests pour déployer un filet de sécurité.

## Je ne doute plus, car je teste

Avant toute chose, il faut garder son calme. L’ampleur de la tâche peut parfois terrifier. En effet, comme on contrôle mal le code, toute erreur peut prendre des proportions importantes. Cependant, il est possible de se sécuriser. Pour cela, rien de mieux que de couvrir le code par des tests.

Les auteurs de *Software Craft* décrivent deux stratégies possibles :

1. Comprendre le métier comme point d’appui des tests.
2. Capturer le comportement du code dans un **Golden Master** autour duquel articuler les tests.

Je m’inscris plus dans la seconde stratégie. Il existe des cas où la connaissance métier est trop éparpillée ou même perdue. Dans ce cas, je pense à ce qu’Arnaud Lemaire dit dans sa conférence :

> "Ce qui est important n’est pas ce que le code est supposé faire, mais ce qu’il fait réellement."

### La technique du Golden Master

Un Golden Master est un « enregistrement » de l’ensemble des comportements du logiciel pour le périmètre d’intervention. Par exemple, si j’interviens sur l’ajout d’une ligne de paiement dans un logiciel de comptabilité, le scénario peut être :

1. Entrée des paramètres du paiement (date, heure, lieu, personne, montant…) ;
2. Vérification des paramètres d’entrée ;
3. Enregistrement dans la table du paiement ;
4. Lecture des nouvelles inscriptions dans la table ;
5. Affichage d’un message de confirmation de l’ajout du paiement ;
6. Affichage de tous les paiements.

On détaille ensuite chaque étape pour couvrir le fonctionnel avec des tests unitaires, automatiques et exécutables à la volée. Lorsque l’on rend son code testable, on est confronté à des problèmes de dépendances. Il faut alors les isoler (mocks, stubs).

**Conseil :** N’essayez pas d’atteindre les 100 % de couverture. C’est illusoire compte tenu du coût total. Visez 80 % de couverture globale avec l’emphase sur toutes les fonctions critiques.

## Moderniser le code

Déployer un filet de sécurité est à peine le début. Gardez en tête que cela ne facilite pas le refactoring dans l'immédiat, mais cela permet de travailler en sécurité.

Ainsi, on passe au refactoring. D’expérience, j’estime qu’il faut :

* **Accorder les violons :** Je conseillerai de partir du *Clean Code* et d’adapter au besoin. Les règles sont faites pour évoluer afin d’obtenir l’adhésion de toutes et tous. Cependant, s’il faut lire une documentation de plusieurs pages pour comprendre à quoi sert telle variable, c’est qu’il est temps d’adopter des règles de nommage explicites. Le code doit être compréhensible sans nécessiter d’effort cognitif hors de propos.
* **Réduire la complexité :** Éviter les indentations profondes, les boucles imbriquées, les méthodes publiques trop nombreuses. Ici, j’applique les principes **SOLID**.
* **Le mieux est l’ennemi du bien :** Chercher à optimiser chaque portion de code coûte cher et n’apporte pas toujours un gain significatif. Cherchez-vous un optimum global ou local ? Améliorez-vous la compréhension du code ?
* **Défaire pour refaire :** Il peut être intéressant de dégrader une portion de code temporairement pour mettre en avant des problèmes dissimulés (ex: renommer des variables pour révéler du code dupliqué).
* **Confronter les idées :** Travaillez en groupe (pair-programming, mob-programming). De l’union naît la force.

## Ça s’arrête quand ?

Une fois lancé, il est tentant de continuer et de s’imaginer tout réécrire. Or, gardons en tête d’où l’on part et quel est notre périmètre.

Il est vain de chercher un code parfait. La notion elle-même est creuse. Mais n’oublions pas que l’on doit respecter un équilibre entre coût et gain.

Vos objectifs minimaux doivent être :

1. **Lisibilité :** On comprend à quoi sert chaque variable, fonction et classe. On peut suivre le flux aisément.
2. **Maintenabilité :** Une modification ne cause pas d'effets de bord insoupçonnés.
3. **Compréhension :** Des tests couvrent le code et documentent son fonctionnement.

Pour illustrer cette notion, je reprendrai la citation de **Kent Beck** :

> "For each desired change, make the change easy (warning: this may be hard), then make the easy change."

L’effort à mettre sur un code legacy peut être infini, il faut donc cadrer son sujet et ne pas chercher la perfection.
Félicitations, vous avez rendu la vie des prochaines générations de développeurs et développeuses meilleure.

---

### Références et inspirations

* **Michael FEATHERS** : *Working Effectively With Legacy Code*, Addison-Wesley, 2004
* **Martin FOWLER** : *Refactoring, Improving the Design of Existing Code*, Addison-Wesley, 2018
* **Cyrille MARTRAIRE et al.** : *Software Craft, TDD, Clean Code et autres pratiques essentielles*, Dunod, 2022
* **Arnaud LEMAIRE** : *Le projet Legacy, quelles stratégies pour s'en sortir ?*, Conférence YouTube, 2021
* **Kent BECK** : *Twitter/X Status*, 2012
* Le site [Refactoring Guru](https://refactoring.guru/)
* Le [Manifeste Software Craftsmanship](https://manifesto.softwarecraftsmanship.org/)
