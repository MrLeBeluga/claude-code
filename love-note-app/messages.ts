export type Mood = "doux" | "drole";

export const MESSAGES: Record<Mood, string[]> = {
  doux: [
    "Tu es la meilleure chose qui me soit arrivée. 💕",
    "Chaque jour avec toi est mon préféré.",
    "Ton sourire est mon endroit préféré au monde.",
    "Je pourrais t'écouter parler pendant des heures.",
    "Avec toi, même les jours gris deviennent doux.",
    "Tu me rends meilleur, chaque jour un peu plus.",
    "J'ai de la chance de t'avoir trouvée.",
    "Tu es mon calme dans le chaos.",
    "Rien que penser à toi me fait sourire bêtement.",
    "Tu es la personne que je choisirais encore et encore.",
    "Ton bonheur, c'est un peu le mien aussi.",
    "Je t'aime plus qu'hier, un peu moins que demain.",
    "Tu rends tout plus léger, plus beau, plus vrai.",
    "Avec toi, j'ai trouvé mon endroit préféré : chez toi.",
    "Tu es la raison pour laquelle je souris à mon téléphone comme un idiot.",
  ],
  drole: [
    "Officiellement plus mignonne que tous les chats d'Internet réunis. 🐱",
    "Tu es tellement parfaite que ça devrait être illégal.",
    "Alerte : niveau de craquage critique détecté. 🚨",
    "Je t'aime même quand tu voles toute la couette.",
    "Tu es la seule personne pour qui j'accepte de partager mes frites.",
    "Si l'amour était un sport, on aurait déjà une médaille d'or.",
    "Tu es mon wifi préféré : toujours connectée à mon cœur.",
    "Je t'aime plus que la pizza, et ça, c'est énorme.",
    "Tu es la preuve vivante que je peux avoir de la chance dans ma vie.",
    "Attention : cette personne est officiellement irremplaçable.",
    "Tu me rends niais, et honnêtement, je m'en fiche complètement.",
    "T'es tellement top que même mon ex serait jaloux de moi.",
    "Je te choisirais toi, même un lundi matin sans café.",
    "Tu es la meilleure erreur de calcul de ma vie amoureuse (dans le bon sens).",
    "Un jour sans toi, c'est un peu comme un wifi sans mot de passe : ça sert à rien.",
  ],
};

export function randomMessage(mood: Mood, exclude?: string): string {
  const pool = MESSAGES[mood];
  if (pool.length === 1) return pool[0];
  let pick = pool[Math.floor(Math.random() * pool.length)];
  while (pick === exclude) {
    pick = pool[Math.floor(Math.random() * pool.length)];
  }
  return pick;
}
