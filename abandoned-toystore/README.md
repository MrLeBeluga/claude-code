# Toy Zone — Abandonné

Petit walking-sim d'horreur en Three.js. Une salle : un magasin de jouets fermé depuis longtemps, un cristal qui brille encore quelque part dedans.

## Jouer tout de suite

Ouvre `dist/index.html` directement dans ton navigateur (double-clic). Rien à installer, ça marche hors ligne.

- **ZQSD / WASD** — se déplacer
- **Souris** — regarder autour
- **E** — ramasser le cristal une fois à proximité
- **Échap** — libérer la souris

## Développer / modifier

```bash
npm install
npm run dev      # serveur de dev avec rechargement à chaud
npm run build    # régénère dist/index.html (fichier unique, autonome)
```

- `src/world.js` — la salle, les props (étagères, distributeurs de bonbons, machine à pince, enseigne, cristal), l'éclairage, le brouillard
- `src/player.js` — contrôleur FPS (déplacement, collisions, head-bob)
- `src/postprocessing.js` — bloom, vignette, grain
- `src/textures.js` — toutes les textures sont générées par code (canvas), pas d'images externes

## Pistes d'amélioration

- Plus de pièces / un couloir qui relie plusieurs zones
- Une menace qui traque le joueur (actuellement pure exploration)
- Sons d'ambiance (bourdonnement du néon, grincements)
- Plusieurs objets à collecter avec un objectif final
