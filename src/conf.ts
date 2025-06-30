type AllowedEmojiReaction = '🤡' | '😭' | '😐' | '😎' | '🤯' | '🏆' | '🤨'

export const LEAGUE_NAMES: Record<number, string> = {
  1: 'Lliga Polar',
  2: 'Minilliga',
  3: 'Lliga Floral',
  4: 'Lliga del Drac',
  5: 'Lliga del Raig',
  6: 'Lliga del Meló',
  7: 'Lliga Seca',
  8: 'Lliga Major',
  9: 'Lliga Escolar',
  10: 'Lliga Castanyera',
  11: 'Lliga de la Mosca',
  12: 'Lliga de Nadal',
}

export const LEAGUE_EMOJI: Record<number, string> = {
  1: '⛄️',
  2: '🐥',
  3: '🌻',
  4: '🐉',
  5: '⚡',
  6: '🍈',
  7: '💨',
  8: '🍾',
  9: '🏫',
  10: '🌰',
  11: '🪰',
  12: '🐫🐫🐫',
}

export const EMOJI_REACTIONS: Record<number, AllowedEmojiReaction> = {
  0: '🤡',
  1: '😭',
  2: '😐',
  3: '😎',
  4: '🤯',
  5: '🏆',
  6: '🤨',
}

export const CHARACTERS = [
  {
    id: 1,
    name: 'Jacint Verdaguer',
    hability: 8,
  },
  {
    id: 2,
    name: 'Josep Lopez',
    hability: 6,
  },
  {
    id: 3,
    name: 'Rovelló',
    hability: 2,
  },
]

// ID is the month and the position
export const AWARDS = [
  // Lliga del Raig
  {
    id: 50,
    name: "Zeus d'or",
    emoji: '🥇🧔🏼',
  },
  {
    id: 51,
    name: 'Tro de plata',
    emoji: '🥈⛈️',
  },
  {
    id: 52,
    name: 'Patac de bronze',
    emoji: '🥉☂️',
  },
  // Lliga del meló
  {
    id: 60,
    name: 'Meló amb pernil',
    emoji: '🥇🍈',
  },
  {
    id: 61,
    name: 'Meló groc de plata',
    emoji: '🥈🍈',
  },
  {
    id: 62,
    name: 'Coco de bronze',
    emoji: '🥉🥥',
  },
  // Lliga Seca
  {
    id: 70,
    name: "Camell d'or",
    emoji: '🥇🐫',
  },
  {
    id: 71,
    name: 'Cactus de plata',
    emoji: '🥈🌵',
  },
  {
    id: 72,
    name: 'Grill de bronze',
    emoji: '🥉🦗',
  },
  // Lliga Major
  {
    id: 80,
    name: "Ratafia d'or",
    emoji: '🥇🥃',
  },
  {
    id: 81,
    name: 'Birra de plata',
    emoji: '🥈🍺',
  },
  {
    id: 82,
    name: 'Cubata de bronze',
    emoji: '🥉🍹',
  },
]
