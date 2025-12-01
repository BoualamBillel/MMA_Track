# MMA Track

MMA Track est une application web moderne permettant de suivre les événements majeurs de MMA (UFC, Bellator, PFL, ONE, etc.), d’explorer les fightcards et de visualiser les comptes à rebours avant chaque combat.

## Fonctionnalités principales

- **Liste des événements à venir** : Affichage des galas majeurs avec date, organisation, lien Tapology, etc.
- **Fightcards détaillées** : Pour chaque événement, visualisez les combats, les combattants, leurs records, nationalités et photos.
- **Compte à rebours dynamique** : Un timer stylisé façon "fight night" indique le temps restant avant chaque événement.
- **Filtres par organisation** : Filtrez les événements par ligue (UFC, Bellator, PFL, ONE…)
- **Recherche rapide** : Trouvez un événement par nom ou date.
- **Design responsive** : Interface moderne, sombre, adaptée mobile et desktop.

## Aperçu

![Aperçu de l’application - Accueil](public/preview.png)

![Aperçu de l’application - Fightcard](public/preview2.png)

## Technologies utilisées

- **React** (Vite)
- **CSS Modules** (animations, gradients, responsive)
- **Hooks personnalisés** (gestion des timers, filtres)
- **Données mockées** (fichier `mockEvents.js`)

## Structure du projet

```
app/
  src/
	 components/      // Composants React (EventCard, FightCard, EventTimer...)
	 data/            // Données mockées (événements, fights)
	 hooks/           // Hooks personnalisés (useEvents...)
	 assets/          // Images, logos, etc.
	 App.jsx          // Point d’entrée principal
	 main.jsx         // Bootstrap React
  public/
	 preview.png      // Capture d’écran de l’app
```

## Lancer le projet en local

1. **Cloner le repo**
	```bash
	git clone <repo-url>
	cd MMA_Track/app
	```
2. **Installer les dépendances**
	```bash
	npm install
	```
3. **Démarrer le serveur de dev**
	```bash
	npm run dev
	```
4. Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Personnalisation

- Ajoutez vos propres événements dans `src/data/mockEvents.js`.
- Modifiez les styles dans les fichiers CSS des composants.

## Auteur


Boualam Billel

## Remerciements & crédits

- Utilisation de l’API [mma-fights-api](https://github.com/onkyoh/mma-fights-api) développée par **Adnan Radwan** ([onkyoh](https://github.com/onkyoh)) pour l’accès aux données d’événements et de combats en temps réel.

---

*Projet personnel pour fans de MMA. Non affilié aux organisations officielles.*