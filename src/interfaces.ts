export interface FormattedMessage {
  text: string
  parse_mode: 'HTML' | 'Markdown' | 'MarkdownV2'
}

export interface Puntuacio {
  id: number
  name: string
  total: number
}

export interface Award {
  id: number
  name: string
  description: string
  image: string
}

export interface Result {
  id: number
  name: string
  total: number
}

export interface SBCharacter {
  id: number
  name: string
  hability: number
}

export interface User {
  id: number
  name: string
}

export interface Player {
  name: string
  total: number
}

export interface SBAward {
  trophy_id: number
  users: { id: number; name: string }
  characters: { id: number; name: string }
  chat_id: number
  created_at: string
}

export interface Award {
  id: number
  chatId: number
  userId: number
  userName: string
  name: string
  emoji: string
  date: string
}
