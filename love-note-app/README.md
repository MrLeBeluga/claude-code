# love-note-app 💌

Petit prototype d'app mobile mignonne et rigolote : un bouton cœur qui envoie
un petit mot doux ou drôle, avec le prénom de ta copine et un compteur de
"doses d'amour" du jour.

## Lancer le prototype sur ton téléphone

1. Installe l'app **Expo Go** sur ton téléphone (App Store / Play Store).
2. Sur l'ordinateur, dans ce dossier :

   ```bash
   npm install
   npx expo start
   ```

3. Scanne le QR code affiché dans le terminal avec l'appareil photo (iOS) ou
   l'app Expo Go (Android).

## Fonctionnalités

- Bouton cœur animé qui affiche un message aléatoire (doux ou drôle).
- Bascule entre deux ambiances : "Doux 💕" et "Drôle 😂".
- Prénom personnalisable (touche le titre en haut pour le modifier).
- Compteur du nombre de messages envoyés dans la journée, sauvegardé
  localement.

## Personnaliser les messages

Les messages sont dans `messages.ts`, ajoute-en autant que tu veux dans les
tableaux `doux` et `drole`.
