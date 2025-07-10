import { adminSupabase } from '../lib/supabase.ts'
import { getWordSolution } from './check-correct-word.ts'
import { getAllUniqueGamesOfToday } from '../api/games.ts'

async function getWordAverageTries() {
  const todayGames = await getAllUniqueGamesOfToday()

  const averagePoints =
    todayGames.reduce(
      (sum: number, game: { punctuation: number }) => sum + game.punctuation,
      0
    ) / todayGames.length

  const tries = 7 - averagePoints

  return parseFloat(tries.toFixed(2))
}

export async function saveTodayWord(): Promise<void> {
  try {
    const word = await getWordSolution()
    const average_tries = await getWordAverageTries()

    const { error } = await adminSupabase
      .from('words')
      .insert({ word, average_tries: average_tries })

    if (error) {
      console.error('Error saving word:', error)
      throw error
    }

    console.log("Today's word saved successfully: " + word)
  } catch (error) {
    console.error("Failed to save today's word:", error)
    throw error
  }
}

saveTodayWord()
