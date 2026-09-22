# love-note-app 💌

Petit prototype d'app mobile mignonne et rigolote : un bouton cœur qui envoie
un petit mot doux ou drôle en temps réel entre deux téléphones, avec un
prénom par personne et un compteur de "doses d'amour" du jour.

## Lancer le prototype sur ton téléphone

1. Installe l'app **Expo Go** sur ton téléphone (App Store / Play Store).
2. Sur l'ordinateur, dans ce dossier :

   ```bash
   npm install
   npx expo start
   ```

3. Scanne le QR code affiché dans le terminal avec l'appareil photo (iOS) ou
   l'app Expo Go (Android).

Ou ouvre directement la version web publiée (pas d'installation requise),
sur les deux téléphones.

## Fonctionnalités

- Bouton cœur animé qui envoie un message aléatoire (doux ou drôle) à
  l'autre personne, en temps réel via Firebase Firestore.
- Bascule entre deux ambiances : "Doux 💕" et "Drôle 😂".
- Chaque téléphone a son propre prénom (touche le titre en haut pour le
  modifier au premier lancement).
- Fil des derniers messages reçus, avec animation à l'arrivée d'un
  nouveau cœur.
- Compteurs "envoyés" / "reçus" du jour.

## Configuration Firebase

`firebase.ts` contient la config du projet Firebase (Firestore) utilisé
pour synchroniser les messages entre les deux téléphones. La collection
`hearts` doit avoir des règles de sécurité autorisant lecture/écriture :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /hearts/{document} {
      allow read, write: if true;
    }
  }
}
```

## Personnaliser les messages

Les messages sont dans `messages.ts`, ajoute-en autant que tu veux dans les
tableaux `doux` et `drole`.
