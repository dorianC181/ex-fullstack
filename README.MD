# Cordon-Bleu Backend

API REST pour l'application Cordon-Bleu.

## Stack
- Node.js
- Express.js
- TypeScript
- MariaDB

## Routes

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

### Recettes
- GET /api/recipes/home
- GET /api/recipes
- GET /api/recipes/search?q=...
- GET /api/recipes/:id
- POST /api/recipes
- POST /api/recipes/:id/duplicate
- PUT /api/recipes/:id
- DELETE /api/recipes/:id

## Règles métier

### Difficulté
- four + matériel spécifique + ingrédients exotiques = Difficile
- four OU matériel spécifique OU ingrédients exotiques = Difficulté moyenne
- sinon = Facile

### Popularité
- la page d'accueil affiche les 10 recettes les plus consultées
- une recette non consultée depuis 10 jours ne doit plus apparaître
- sauf si elle provient de France