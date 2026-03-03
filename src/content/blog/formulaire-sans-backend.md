---
title: "Formulaires sans Backend : Intercepter Formspree avec AJAX pour une UX fluide"
description: "Ne laissez plus Formspree rediriger vos utilisateurs ! Découvrez comment utiliser AJAX pour envoyer vos formulaires de contact en arrière-plan sur votre site Astro."
pubDate: "2026-03-03"
image: "../../assets/formspree-ajax-astro.png"
imageAlt: "Une enveloppe lumineuse traversant un portail numérique, symbolisant l'envoi de données en arrière-plan sans rechargement. Image générée par IA."
imageCaption: "L'art de l'envoi silencieux. Image générée par IA."
aiDisclaimer: "Article écrit avec l'aide de l'IA."
tags: ["Astro", "JavaScript", "UX", "Tutoriel"]
---

Quand on construit un site statique avec Astro, la question du formulaire de contact se pose inévitablement. Sans serveur (backend) pour traiter l'envoi de l'email, comment faire ?

La solution la plus populaire s'appelle **Formspree** (ou Web3Forms, Netlify Forms, etc.). Vous mettez une URL spécifique dans l'attribut `action` de votre formulaire HTML, et leur service s'occupe de vous envoyer le mail. Magique.

**Sauf qu'il y a un énorme problème d'UX.**

Par défaut, quand l'utilisateur clique sur "Envoyer", il est violemment redirigé vers une page de remerciement générique hébergée chez Formspree, ou subit un rechargement complet de la page s'il utilise un paramètre de redirection. Adieu la navigation fluide.

Aujourd'hui, on va régler ça. Nous allons intercepter la soumission du formulaire avec JavaScript (AJAX) pour envoyer les données en arrière-plan, et afficher un beau message de succès sans jamais quitter la page.

## 1. La structure HTML (Le composant Astro)

Commençons par créer notre formulaire de contact dans un composant (ex: `ContactForm.astro`).

L'astuce ici est de préparer un conteneur pour le formulaire complet, et un autre (masqué par défaut) pour le message de succès.

```astro
---
// src/components/ContactForm.astro
// Remplacez cette URL par celle fournie par Formspree
const FORMSPREE_URL = "[https://formspree.io/f/VOTRE_ID_ICI](https://formspree.io/f/VOTRE_ID_ICI)";
---

<div id="contact-container">
  <form id="contact-form" action={FORMSPREE_URL} method="POST">
    <label for="email">Votre Email</label>
    <input type="email" id="email" name="email" required />
    
    <label for="message">Votre Message</label>
    <textarea id="message" name="message" required></textarea>
    
    <button type="submit" id="submit-button">Envoyer le message</button>
    <p id="error-message" style="display: none; color: red;">Oups, une erreur est survenue.</p>
  </form>

  <div id="success-message" style="display: none;">
    <h3>✨ Message envoyé avec succès !</h3>
    <p>Merci pour votre message, je vous réponds très vite.</p>
  </div>
</div>
```

## 2. La magie de l'interception (JavaScript)

Dans Astro, il suffit d'ajouter une balise `<script>` à la fin de notre composant. Astro va automatiquement l'isoler, la minifier et l'exécuter côté client.

L'objectif de notre script est simple :

1. Écouter l'événement `submit` du formulaire.
2. Bloquer le comportement par défaut (la fameuse redirection) avec `e.preventDefault()`.
3. Récupérer les données via `FormData`.
4. Les envoyer silencieusement avec la fonction native `fetch()`.

``` astro
<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const submitButton = document.getElementById('submit-button') as HTMLButtonElement;

  if (form) {
    form.addEventListener('submit', async (e) => {
      // 1. On bloque la redirection sauvage !
      e.preventDefault();

      // 2. On change l'état du bouton pour faire patienter l'utilisateur
      submitButton.disabled = true;
      submitButton.innerText = "Envoi en cours...";
      errorMessage.style.display = 'none';

      try {
        // 3. On prépare les données
        const formData = new FormData(form);
        
        // 4. On envoie la requête AJAX en POST
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            'Accept': 'application/json' // Crucial pour Formspree
          }
        });

        if (response.ok) {
          // 5. C'est un succès ! On cache le form et on affiche le message
          form.style.display = 'none';
          if (successMessage) successMessage.style.display = 'block';
        } else {
          throw new Error('Erreur réseau');
        }
      } catch (error) {
        // En cas de pépin, on réactive le bouton et on affiche l'erreur
        if (errorMessage) errorMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.innerText = "Envoyer le message";
      }
    });
  }
</script>
```

### Le détail qui tue : le header Accept

Si vous regardez bien le code du `fetch()`, j'ai ajouté un header `Accept: 'application/json'`. Sans ça, Formspree essaiera quand même de vous renvoyer du HTML (leur page de remerciement). En précisant qu'on veut du JSON, Formspree comprend qu'on fait une requête AJAX et nous répond proprement en arrière-plan avec un simple `{ "ok": true }`.

## Conclusion

En quelques dizaines de lignes de JavaScript "Vanilla" (sans aucune librairie lourde), nous venons de transformer une expérience utilisateur frustrante en une interaction fluide et moderne.

C'est ça la philosophie d'un bon Project Manager / Développeur : utiliser des outils simples pour aller vite (Formspree), tout en maîtrisant la technique pour garantir un résultat professionnel et centré sur l'utilisateur.

Vous ne me croyez pas ? Allez tester tout ça en direct sur la page [Contact](https://www.vbesse.com/contact) de mon site !
