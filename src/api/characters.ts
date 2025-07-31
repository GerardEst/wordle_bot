import { SBCharacter } from '../interfaces.ts'
import { supabase } from '../lib/supabase.ts'

export function transformChatCharacters(data: { characters: SBCharacter }[]): SBCharacter[] {
  return data.map((record) => {
    return {
      id: record.characters.id,
      name: record.characters.name,
      hability: record.characters.hability,
    }
  })
}

export function findCharacterIdByName(characters: SBCharacter[], name: string): number | null {
  const character = characters.find(char => char.name === name)
  return character ? character.id : null
}

export async function addCharacterToChat(
  chatId: number,
  characterName: string
) {
  const characterId = await getCharacterIdByName(characterName)
  console.log(characterId)

  const { data, error } = await supabase
    .from('characters_chats')
    .insert([{ chat_id: chatId, character_id: characterId }])
    .select()

  if (error) {
    console.error(error)
    throw 'Error adding character to chat'
  }

  return data[0]
}

export async function removeCharacterFromChat(
  chatId: number,
  characterName: string
) {
  const characterId = await getCharacterIdByName(characterName)

  const { data, error } = await supabase
    .from('characters_chats')
    .delete()
    .eq('chat_id', chatId)
    .eq('character_id', characterId)
    .select()

  if (error) {
    console.error(error)
    throw 'Error removing character from chat'
  }

  return data[0]
}

export async function getChatCharacters(chatId: number) {
  const { data, error } = await supabase
    .from('characters_chats')
    .select('characters(id, name, hability)')
    .eq('chat_id', chatId)

  if (error) {
    throw 'Error getting chat characters'
  }

  // SUPABASE BUG #01
  return transformChatCharacters(data as unknown as { characters: SBCharacter }[])
}

export async function getAllCharacters() {
  const { data, error } = await supabase
    .from('characters')
    .select('id, name, hability')
  if (error) {
    throw 'Error getting character id by name'
  }
  return data
}

async function getCharacterIdByName(name: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('id')
    .eq('name', name)
  if (error) {
    throw 'Error getting character id by name'
  }
  return data[0].id
}
