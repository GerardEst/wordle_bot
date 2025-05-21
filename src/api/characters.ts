const airtableChatCharactersUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_CHARS_CHATS')}`

import { CHARACTERS } from '../conf.ts'

interface Character {
  fields: {
    'ID Personatge': number
  }
}

export async function addCharacterToChat(
  chatId: number,
  characterName: string
) {
  const character = CHARACTERS.find((c) => c.name === characterName)

  if (!character) {
    console.error('Character not found')
    return
  }

  const res = await fetch(airtableChatCharactersUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            'ID Xat': chatId,
            'ID Personatge': character.id,
            Nom: character.name,
            Habilitat: character.hability,
          },
        },
      ],
    }),
  })

  if (!res.ok) {
    console.error('Error creant el registre:', await res.text())
    return
  }

  const data = await res.json()

  return data.records
}

export async function getChatCharacters(chatId: number) {
  const params = new URLSearchParams({
    filterByFormula: `{ID Xat} = ${chatId}`,
    view: Deno.env.get('TABLE_CHARS_CHATS')!,
  })

  const res = await fetch(`${airtableChatCharactersUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return data.records.map((record: Character) => {
    const character = CHARACTERS.find(
      (c) => c.id === record.fields['ID Personatge']
    )

    if (!character) {
      console.error('Character not found')
      return null
    }

    return {
      id: character.id,
      name: character.name,
      hability: character.hability,
    }
  })
}
