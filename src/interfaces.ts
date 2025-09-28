export type lang = 'cat' | 'es' | 'en'

// SUPABASE INTERFACES

export interface SBGameRecord {
    user_id?: number
    users?: { name: string } // SUPABASE BUG #01 - supabase types expect users: { name: string }[], but supabase is returning: { name: string }
    character_id?: number
    characters?: { name: string }
    punctuation: number
    time: number
    created_at: string
}

export interface SBCharacter {
    id: number
    name: string
    hability: number
}

export interface SBAward {
    trophy_id: number
    users: { id: number; name: string }
    characters: { id: number; name: string }
    chat_id: number
    created_at: string
}

export interface SBWord {
    word: string
    average_tries: number
}

// APP INTERFACES

export interface RankingEntry {
    id: number
    name: string
    total: number
    totalTime: number
}

export interface Result {
    id: number
    name: string
    total: number
    totalTime: number
}

export interface Player {
    name: string
    total: number
    totalTime: number
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

export interface FormattedMessage {
    text: string
    parse_mode: 'HTML' | 'Markdown' | 'MarkdownV2'
}

export interface PlayerFromGlobal {
    user_id: number
    user_name: string
    games_count: number
    total_points: number
    avg_time: number
}
