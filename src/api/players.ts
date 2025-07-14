import { supabase } from '../lib/supabase.ts'

export async function createPlayerIfNotExist(userId: number, userName: string) {
  try {
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .select()

    if (error) throw error

    if (!existingUser[0]) {
      const { data, error } = await supabase
        .from('users')
        .insert({ id: userId, name: userName })
      if (error) throw error
      return data
    }

    return existingUser
  } catch (error) {
    console.error('Error creating player if not exist', error)
    return
  }
}
