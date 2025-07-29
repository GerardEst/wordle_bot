import { assertEquals } from '@std/assert'
import { SBGameRecord } from '../../src/interfaces.ts'
import { getCleanedRanking } from '../../src/api/games.ts'

Deno.test('getCleanedRanking - should handle empty records', () => {
  const result = getCleanedRanking([])
  assertEquals(result, [])
})

Deno.test('getCleanedRanking - should return empty array for records with missing userId/characterId', () => {
  const records: SBGameRecord[] = [
    {
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  assertEquals(result, [])
})

Deno.test('getCleanedRanking - should return empty array for records with missing name', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  assertEquals(result, [])
})

Deno.test('getCleanedRanking - should process single user record correctly', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  assertEquals(result, [
    { id: 1, name: 'Player1', total: 5 }
  ])
})

Deno.test('getCleanedRanking - should process character records correctly', () => {
  const records: SBGameRecord[] = [
    {
      character_id: 100,
      characters: { name: 'Character1' },
      punctuation: 6,
      created_at: '2024-07-15T10:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  assertEquals(result, [
    { id: 100, name: 'Character1', total: 6 }
  ])
})

Deno.test('getCleanedRanking - should sort by total points descending', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 3,
      created_at: '2024-07-15T10:00:00.000Z'
    },
    {
      user_id: 2,
      users: { name: 'Player2' },
      punctuation: 6,
      created_at: '2024-07-15T10:00:00.000Z'
    },
    {
      user_id: 3,
      users: { name: 'Player3' },
      punctuation: 4,
      created_at: '2024-07-15T10:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  assertEquals(result, [
    { id: 2, name: 'Player2', total: 6 },
    { id: 3, name: 'Player3', total: 4 },
    { id: 1, name: 'Player1', total: 3 }
  ])
})

Deno.test('getCleanedRanking - should deduplicate records from same user on same Spain date', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z' // Morning in UTC (12:00 Spain summer time)
    },
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 3,
      created_at: '2024-07-15T20:00:00.000Z' // Evening in UTC (22:00 Spain summer time)
    }
  ]
  const result = getCleanedRanking(records)
  // Should only count the first record (5 points) as both are on the same Spain date
  assertEquals(result, [
    { id: 1, name: 'Player1', total: 5 }
  ])
})

Deno.test('getCleanedRanking - should count records from different Spain dates', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z' // July 15
    },
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 3,
      created_at: '2024-07-16T10:00:00.000Z' // July 16
    }
  ]
  const result = getCleanedRanking(records)
  // Should count both records as they're on different Spain dates
  assertEquals(result, [
    { id: 1, name: 'Player1', total: 8 }
  ])
})

Deno.test('getCleanedRanking - should handle timezone edge case (UTC day change)', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 5,
      created_at: '2024-07-15T22:30:00.000Z' // 22:30 UTC = 00:30 Spain (next day)
    },
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 3,
      created_at: '2024-07-16T01:00:00.000Z' // 01:00 UTC = 03:00 Spain (same Spain day as above)
    }
  ]
  const result = getCleanedRanking(records)
  // Both should be counted as same Spain date (July 16), so only first one counts
  assertEquals(result, [
    { id: 1, name: 'Player1', total: 5 }
  ])
})

Deno.test('getCleanedRanking - should handle mixed users and characters', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z'
    },
    {
      character_id: 100,
      characters: { name: 'Character1' },
      punctuation: 6,
      created_at: '2024-07-15T10:00:00.000Z'
    },
    {
      user_id: 2,
      users: { name: 'Player2' },
      punctuation: 4,
      created_at: '2024-07-15T10:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  assertEquals(result, [
    { id: 100, name: 'Character1', total: 6 },
    { id: 1, name: 'Player1', total: 5 },
    { id: 2, name: 'Player2', total: 4 }
  ])
})

Deno.test('getCleanedRanking - should accumulate points across multiple valid dates', () => {
  const records: SBGameRecord[] = [
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 5,
      created_at: '2024-07-15T10:00:00.000Z'
    },
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 3,
      created_at: '2024-07-16T10:00:00.000Z'
    },
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 6,
      created_at: '2024-07-17T10:00:00.000Z'
    },
    {
      user_id: 1,
      users: { name: 'Player1' },
      punctuation: 2, // This should be ignored (duplicate of July 17)
      created_at: '2024-07-17T15:00:00.000Z'
    }
  ]
  const result = getCleanedRanking(records)
  // Should total: 5 + 3 + 6 = 14 (ignoring the duplicate from July 17)
  assertEquals(result, [
    { id: 1, name: 'Player1', total: 14 }
  ])
})