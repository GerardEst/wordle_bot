type AllowedEmojiReaction = "💩" | "😭" | "😐" | "😎" | "🤯" | "🏆" | "🤨";

export const ALLOWED_NONPLAYED_DAYS_IN_TIMETRIAL = 5;

export const LEAGUE_NAMES: any = {
  cat: {
    1: "Lliga Polar",
    2: "Minilliga",
    3: "Lliga Floral",
    4: "Lliga del Drac",
    5: "Lliga del Raig",
    6: "Lliga del Meló",
    7: "Lliga Seca",
    8: "Lliga Major",
    9: "Lliga de Catalunya",
    10: "Lliga Castanyera",
    11: "Lliga de la Mosca",
    12: "Lliga de Nadal",
  },
  es: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "Liga Mayor",
    9: "Liga Escolar",
    10: "Liga Otoñal",
    11: "",
    12: "Liga de Navidad",
  },
  en: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "Desert League",
    9: "Students League",
    10: "Halloween League",
    11: "",
    12: "Christmas League",
  },
};

export const LEAGUE_EMOJI: any = {
  cat: {
    1: "⛄️",
    2: "🐥",
    3: "🌻",
    4: "🐉",
    5: "⚡",
    6: "🍈",
    7: "💨",
    8: "💃🏻",
    9: "💛",
    10: "🌰",
    11: "🪰",
    12: "🐫🐫🐫",
  },
  es: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "💃🏻",
    9: "🚸",
    10: "🌰",
    11: "",
    12: "🐫🐫🐫",
  },
  en: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "🐫",
    9: "🚸",
    10: "🎃",
    11: "",
    12: "🎅🏽",
  },
};

export const LEAGUE_BYE_MESSAGE: any = {
  cat: {
    1: "⛄️",
    2: "🐥",
    3: "🌻",
    4: "🐉",
    5: "⚡",
    6: "🍈",
    7: "💨",
    8: "Heu arribat al final d'aquesta lliga, la lliga de la calor, de les vacances i de les festes majors. Han estat 31 dies de lluita intensa, ho sé, i aquí us porto la recompensa: Premis! I per la Lliga Major, premis de Festa Major!",
    9: "(Catedral de Girona, una veu greu anuncia el final de la Lliga de Catalunya. Solemnes, tots els presents canten) - Catalunya triomfant, tornarà a ser rica i plena, endarrera aquesta gent que del Mooot no sap cap lletra.\n\nCatalans i catalanes, ja teniu els vostres premis aquí!",
    10: "🌰",
    11: "🪰",
    12: "🐫🐫🐫",
  },
  es: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "💃🏻",
    9: "🚸",
    10: "",
    11: "",
    12: "🐫🐫🐫",
  },
  en: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "🐫",
    9: "🚸",
    10: "",
    11: "",
    12: "🎅🏽",
  },
};

export const LEAGUE_BYE_MESSAGE_ENDING: any = {
  cat: {
    1: "⛄️",
    2: "🐥",
    3: "🌻",
    4: "🐉",
    5: "⚡",
    6: "🍈",
    7: "💨",
    8: "Ja debeu saber que demà comença el Setembre, l'escola, la rutina... el que no sabieu és que també comença la llegendaria Lliga de Catalunya, amb premis com el Segador d'or o la Gralla de bronze. Que segueixi la festa!",
    9: "Disfruteu dels trofeus! Feu una festa catalana, convideu als tions, als gegants de tots els pobles i a les tres bessones, balleu sardanes, pujeu uns a sobre els altres... Però seny! Demà comença la Lliga Castanyera. No abaixem la guardia, segadors.",
    10: "🌰",
    11: "🪰",
    12: "🐫🐫🐫",
  },
  es: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "💃🏻",
    9: "🚸",
    10: "",
    11: "",
    12: "🐫🐫🐫",
  },
  en: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "🐫",
    9: "🚸",
    10: "",
    11: "",
    12: "🎅🏽",
  },
};

export const EMOJI_REACTIONS: Record<number, AllowedEmojiReaction> = {
  0: "💩",
  1: "😭",
  2: "😐",
  3: "😎",
  4: "🤯",
  5: "🏆",
  6: "🤨",
};

// ID is the month and the position
export const AWARDS = {
  cat: [
    // Premis especials
    {
      id: 200,
      name: "Ram de disculpes",
      emoji: "💐",
    },
    // Lliga del Raig
    {
      id: 50,
      name: "Zeus d'or",
      emoji: "🥇🧔🏼",
    },
    {
      id: 51,
      name: "Tro de plata",
      emoji: "🥈⛈️",
    },
    {
      id: 52,
      name: "Patac de bronze",
      emoji: "🥉☂️",
    },

    // Lliga del meló
    {
      id: 60,
      name: "Meló amb pernil",
      emoji: "🥇🍈",
    },
    {
      id: 61,
      name: "Meló groc de plata",
      emoji: "🥈🍈",
    },
    {
      id: 62,
      name: "Coco de bronze",
      emoji: "🥉🥥",
    },
    // Lliga Seca
    {
      id: 70,
      name: "Camell d'or",
      emoji: "🥇🐫",
    },
    {
      id: 71,
      name: "Cactus de plata",
      emoji: "🥈🌵",
    },
    {
      id: 72,
      name: "Grill de bronze",
      emoji: "🥉🦗",
    },
    {
      id: 75,
      name: "Guepard d'or",
      emoji: "🥇🐆",
    },
    {
      id: 76,
      name: "Rinoceront de plata",
      emoji: "🥈🦏",
    },
    {
      id: 77,
      name: "Porquet de bronze",
      emoji: "🥉🐖",
    },
    {
      id: 79,
      name: "Una formiga",
      emoji: "🐜",
    },
    // Lliga Major
    {
      id: 80,
      name: "Ratafia d'or",
      emoji: "🥇🥃",
    },
    {
      id: 81,
      name: "Birra de plata",
      emoji: "🥈🍺",
    },
    {
      id: 82,
      name: "Cubata de bronze",
      emoji: "🥉🍹",
    },
    {
      id: 85,
      name: "Traca d'or",
      emoji: "🥇🧨",
    },
    {
      id: 86,
      name: "Fanalet de plata",
      emoji: "🥈🌷",
    },
    {
      id: 87,
      name: "Pogo de bronze",
      emoji: "🥉💥",
    },
    {
      id: 89,
      name: "Un glaçó",
      emoji: "🧊",
    },
    // Lliga de Catalunya
    {
      id: 90,
      name: "Segador d'or",
      emoji: "🥇🌾",
    },
    {
      id: 91,
      name: "Gegant de plata",
      emoji: "🥈👫🏻",
    },
    {
      id: 92,
      name: "Caganer de bronze",
      emoji: "🥉💩",
    },
    {
      id: 95,
      name: "Anxaneta d'or",
      emoji: "🥇🖐🏼",
    },
    {
      id: 96,
      name: "Sardana de plata",
      emoji: "🥈🤝🏼",
    },
    {
      id: 97,
      name: "Gralla de bronze",
      emoji: "🥉🪈",
    },
    {
      id: 99,
      name: "Una barretina",
      emoji: "🔺",
    },
    // Lliga Castanyera
    {
      id: 100,
      name: "Castanyera d'or",
      emoji: "🥇👵🏼",
    },
    {
      id: 101,
      name: "Panellet de plata",
      emoji: "🥈🥜",
    },
    {
      id: 102,
      name: "Moniato de bronze",
      emoji: "🥉🍠",
    },
    {
      id: 105,
      name: "Rovelló d'or",
      emoji: "🥇🍄‍🟫",
    },
    {
      id: 106,
      name: "Pinetell de plata",
      emoji: "🥈🍄‍🟫",
    },
    {
      id: 107,
      name: "Camagroc de bronze",
      emoji: "🥉🍄‍🟫",
    },
    {
      id: 109,
      name: "Una fulla seca",
      emoji: "🍁",
    },
  ],
  es: [
    // Liga Mayor
    {
      id: 80,
      name: "Combinado de oro",
      emoji: "🥇🥃",
    },
    {
      id: 81,
      name: "Coctel de plata",
      emoji: "🥈🍹",
    },
    {
      id: 82,
      name: "Cerveza de bronce",
      emoji: "🥉🍺",
    },
    {
      id: 85,
      name: "Traca de oro",
      emoji: "🥇🧨",
    },
    {
      id: 86,
      name: "Baile de plata",
      emoji: "🥈🌷",
    },
    {
      id: 87,
      name: "Pogo de bronce",
      emoji: "🥉💥",
    },
    {
      id: 89,
      name: "Un hielo",
      emoji: "🧊",
    },
    // Liga Escolar
    {
      id: 90,
      name: "Doctorado",
      emoji: "🥇📜",
    },
    {
      id: 91,
      name: "Máster",
      emoji: "🥈📜",
    },
    {
      id: 92,
      name: "Grado",
      emoji: "🥉📜",
    },
    {
      id: 95,
      name: "",
      emoji: "🥇",
    },
    {
      id: 96,
      name: "",
      emoji: "🥈",
    },
    {
      id: 97,
      name: "",
      emoji: "🥉",
    },
    {
      id: 99,
      name: "",
      emoji: "",
    },
    // Liga Otoñal
    {
      id: 100,
      name: "Castaña de oro",
      emoji: "🥇🌰",
    },
    {
      id: 101,
      name: "Boniato de plata",
      emoji: "🥈🍠",
    },
    {
      id: 102,
      name: "Calabaza de bronze",
      emoji: "🥉🎃",
    },
    {
      id: 105,
      name: "Caqui maduro",
      emoji: "🥇",
    },
    {
      id: 106,
      name: "Seta del bosque",
      emoji: "🥈",
    },
    {
      id: 107,
      name: "Membrillo",
      emoji: "🥉",
    },
    {
      id: 109,
      name: "Una hoja seca",
      emoji: "🍁",
    },
  ],
  en: [
    // Desert League
    {
      id: 80,
      name: "Gold Sunset",
      emoji: "🥇☀️",
    },
    {
      id: 81,
      name: "Silver Oasis",
      emoji: "🥈🏝️",
    },
    {
      id: 82,
      name: "Bronze Dune",
      emoji: "🥉🏜️",
    },
    {
      id: 85,
      name: "Gold Cheeta",
      emoji: "🥇🐆",
    },
    {
      id: 86,
      name: "Silver Rhino",
      emoji: "🥈🦏",
    },
    {
      id: 87,
      name: "Bronze Camel",
      emoji: "🥉🐫",
    },
    {
      id: 89,
      name: "A desert rock",
      emoji: "🪨",
    },
    // Student League
    {
      id: 90,
      name: "Doctoral degree",
      emoji: "🥇📜",
    },
    {
      id: 91,
      name: "Master's degree",
      emoji: "🥈📜",
    },
    {
      id: 92,
      name: "Bachelor's degree",
      emoji: "🥉📜",
    },
    {
      id: 95,
      name: "",
      emoji: "🥇",
    },
    {
      id: 96,
      name: "",
      emoji: "🥈",
    },
    {
      id: 97,
      name: "",
      emoji: "🥉",
    },
    {
      id: 99,
      name: "",
      emoji: "",
    },
    // Halloween League
    {
      id: 100,
      name: "Gold pumpkin",
      emoji: "🥇🎃",
    },
    {
      id: 101,
      name: "Silver ghost",
      emoji: "🥈👻",
    },
    {
      id: 102,
      name: "Bronze mushroom",
      emoji: "🥉🍄",
    },
    {
      id: 105,
      name: "",
      emoji: "🥇",
    },
    {
      id: 106,
      name: "",
      emoji: "🥈",
    },
    {
      id: 107,
      name: "",
      emoji: "🥉",
    },
    {
      id: 109,
      name: "A candy",
      emoji: "🍭",
    },
  ],
};
