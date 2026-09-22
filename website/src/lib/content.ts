export const contact = {
  address: "Boulevard de la Cambre 12",
  city: "1000 Bruxelles",
  phone: "+32 2 640 44 22",
  phoneHref: "tel:+3226404422",
  email: "reservation@truffenoire.com",
  takeAwayHours: "Jeudi – samedi · 11h – 17h30",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Boulevard+de+la+Cambre+12+Bruxelles",
};

export const carte = [
  {
    section: "Entrées",
    items: [
      { name: "Carpaccio de Bleue des Prés", detail: "Parmesan & truffe", price: 32 },
      { name: "Loup fumé en julienne", detail: "", price: 40 },
    ],
  },
  {
    section: "Plats",
    items: [
      { name: "Filets de saint-pierre farcis", detail: "", price: 50 },
      { name: "Pigeonneau rôti", detail: "", price: 50 },
      { name: "Truffe du Périgord", detail: "« À la croque au sel »", price: 95 },
    ],
  },
];

export const menus = [
  { name: "Découverte", note: "Menu" },
  { name: "Privilège", note: "Menu" },
  { name: "Diamant", note: "Menu" },
  { name: "Corporate", note: "Menu" },
  { name: "Lunch", note: "Formule" },
  { name: "Business Lunch", note: "Formule" },
  { name: "Jeunes Gastronomes", note: "Menu dégustation" },
];

export const boutique = [
  { name: "Huile à la truffe blanche", size: "250 ml", price: "19,50", glyph: "H" },
  { name: "Purée de truffe blanche 89 %", size: "25 g", price: "50,00", glyph: "P" },
  { name: "Sel à la truffe", size: "", price: "10,50", glyph: "S" },
];

export const boutiqueCategories = ["Huiles", "Beurres", "Sels", "Purées", "Vins sélectionnés"];
