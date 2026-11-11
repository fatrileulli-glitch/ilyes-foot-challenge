# ⚽ Ilyes Foot Challenge

Petite appli web (en français) pour un jeune footballeur : il suit sa saison, s'entraîne à la maison et apprend en s'amusant.

## Fonctionnalités

| Onglet | Ce qu'on y fait |
|---|---|
| **Accueil** | Défi du jour, prochain rendez-vous, chiffres de la saison, badges. |
| **Carnet** | Après chaque match : adversaire, score, buts, passes décisives, temps de jeu. Graphiques de la saison : buts et passes par match, courbe de progression (cumul), temps de jeu. Bilan V-N-D. Une saison va d'août à juillet. |
| **Défis** | Un défi par jour (jongles, conduite de balle, tirs, passes, contrôle, physique), le même pour toute la journée. Série de jours d'affilée. Compteur de jongles (on tape sur le gros ballon) avec record et historique. 16 badges à débloquer (« 50 jongles », « 10 jours d'affilée », « Coup du chapeau »…). |
| **Agenda** | Entraînements et matchs saisis à la main : date, heure de rendez-vous, heure de début, lieu, adversaire, notes. Répétition chaque semaine pour les entraînements. Export `.ics` pour ajouter les rendez-vous à l'agenda du téléphone. Un match passé peut être envoyé dans le carnet. |
| **Quiz** | 3 niveaux (Débutant, Confirmé, Expert), 10 questions tirées au hasard par partie, avec explication après chaque réponse. Règles, grands joueurs, clubs, équipe de France. |
| **Album** | Un souvenir par match : photo, adversaire, score, meilleur moment. |

## Données et vie privée

- Tout est enregistré **uniquement sur l'appareil**, dans le navigateur (`localStorage` pour les données, IndexedDB pour les photos). Rien n'est envoyé sur Internet, il n'y a pas de compte.
- Si on efface les données du navigateur, tout est perdu. Dans **⚙️ Réglages**, « Exporter une sauvegarde » crée un fichier `.json` (photos comprises) que l'on peut réimporter, y compris sur un autre téléphone.
- L'agenda du club n'est **pas** récupéré automatiquement : il faut le saisir à la main.

## Lancer l'appli

Aucune installation ni compilation : c'est du HTML/CSS/JavaScript pur, sans dépendance externe.

- **En local** : `python3 -m http.server 8000` dans le dossier, puis ouvrir http://localhost:8000
- **En ligne, gratuitement** : activer GitHub Pages sur ce dépôt (Settings → Pages → branche et dossier racine). Sur le téléphone, ouvrir l'adresse puis « Ajouter à l'écran d'accueil » : l'appli s'ouvre alors comme une appli et marche hors connexion.

## Structure

```
index.html          page unique
css/style.css       styles (mode sombre automatique)
js/store.js         stockage local + photos
js/charts.js        graphiques SVG faits maison
js/data-defis.js    liste des défis
js/data-quiz.js     questions du quiz
js/app.js           écrans et logique
sw.js               fonctionnement hors connexion
```

Pour ajouter des défis ou des questions, il suffit de compléter `js/data-defis.js` ou `js/data-quiz.js`.
