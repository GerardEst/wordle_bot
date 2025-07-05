import { supabase } from '../lib/supabase.ts'

export async function createPlayerIfNotExist(userId: number, userName: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({ id: userId, name: userName })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error upserting player', error)
    return
  }
}
