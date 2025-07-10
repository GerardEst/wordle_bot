import { SBWord } from '../interfaces.ts'
import { supabase } from '../lib/supabase.ts'

export async function getLastWord(): Promise<SBWord | null> {
  console.log('Getting last word in database')

  try {
    const { data, error } = await supabase
      .from('words')
      .select('word, average_tries')
      .order('created_at')
      .limit(1)

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error('Error getting last word', error)
    return null
  }
}
