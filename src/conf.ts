type AllowedEmojiReaction = '🤡' | '😭' | '😐' | '😎' | '🤯' | '🏆' | '🤨'

export const LEAGUE_NAMES: Record<number, string> = {
  1: 'Lliga Polar',
  2: 'Minilliga',
  3: 'Lliga Floral',
  4: 'Lliga del Drac',
  5: 'Lliga del Raig',
  6: 'Lliga del Meló',
  7: 'Lliga del Ventilador',
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
    id: 51,
    name: "Zeus d'or",
    emoji: '⚡🧔🏼',
  },
  {
    id: 52,
    name: 'Tro de plata',
    emoji: '⚡⛈️',
  },
  {
    id: 53,
    name: 'Patac de bronze',
    emoji: '⚡☂️',
  },
  // Lliga del meló
  {
    id: 61,
    name: "Meló d'or amb pernil",
    emoji: '🍈🍗',
  },
  {
    id: 62,
    name: 'Llavor de plata',
    emoji: '🍈🌱',
  },
  {
    id: 63,
    name: 'Coco de bronze',
    emoji: '🥥',
  },
]
