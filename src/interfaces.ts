export interface FormattedMessage {
  text: string
  parse_mode: 'HTML' | 'Markdown' | 'MarkdownV2'
}

export interface Puntuacio {
  id: number
  name: string
  total: number
}

export interface Character {
  id: number
  name: string
  hability: number
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

export interface AirtableCharacter {
  fields: {
    'ID Personatge': number
  }
}

export interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}

export interface AirtableResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export interface PuntuacioFields {
  'ID Xat': number
  'ID Usuari': number
  'Nom Usuari': string
  Puntuació: number
  Joc: string
  Data: string
}

export interface User {
  id: number
  name: string
}

export interface AirtableAward {
  fields: {
    'ID Premi': number
    'ID Xat': number
    'ID Usuari': number
    'Nom Usuari': string
    Data: string
  }
}

export interface Award {
  id: number
  userId: number
  userName: string
  chatId: number
  name: string
  emoji: string
  date: string
}
