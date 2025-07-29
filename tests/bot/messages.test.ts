import { assertEquals } from '@std/assert'
import { Result } from '../../src/interfaces.ts'
import { buildRankingMessageFrom } from '../../src/bot/messages.ts'

const MOCK_RANKING: Result[] = [
  { id: 1, name: 'Player1', total: 100 },
  { id: 2, name: 'Player2', total: 85 },
  { id: 3, name: 'Player3', total: 70 },
  { id: 4, name: 'Player4', total: 60 },
  { id: 5, name: 'Player5', total: 45 },
]

Deno.test('buildRankingMessageFrom - should handle empty ranking', () => {
  const result = buildRankingMessageFrom([])
  assertEquals(result.text, 'Encara no hi ha puntuacions en aquest xat')
  assertEquals(result.parse_mode, 'Markdown')
})

Deno.test('buildRankingMessageFrom - should build basic ranking message', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: 100 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.parse_mode, 'Markdown')
  assertEquals(result.text.includes('Classificació actual'), true)
  assertEquals(result.text.includes('🥇'), true)
  assertEquals(result.text.includes('Player1'), true)
  assertEquals(result.text.includes('100'), true)
})

Deno.test('buildRankingMessageFrom - should use correct medal emojis for top 3', () => {
  const result = buildRankingMessageFrom(MOCK_RANKING)
  
  assertEquals(result.text.includes('🥇'), true)
  assertEquals(result.text.includes('🥈'), true)  
  assertEquals(result.text.includes('🥉'), true)
  assertEquals(result.text.includes('Player1'), true)
  assertEquals(result.text.includes('Player2'), true)
  assertEquals(result.text.includes('Player3'), true)
})

Deno.test('buildRankingMessageFrom - should include league information', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: 100 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('Classificació actual'), true)
  assertEquals(result.text.includes('Falten'), true)
  assertEquals(result.text.includes('dies'), true)
})

Deno.test('buildRankingMessageFrom - should handle special characters in names', () => {
  const ranking = [
    { id: 1, name: 'Àlex Núñez', total: 100 },
    { id: 2, name: '🎮 GamerTag', total: 85 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('Àlex Núñez'), true)
  assertEquals(result.text.includes('🎮 GamerTag'), true)
})

Deno.test('buildRankingMessageFrom - should handle single character names', () => {
  const ranking = [
    { id: 1, name: 'A', total: 100 },
    { id: 2, name: 'X', total: 85 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('A'), true)
  assertEquals(result.text.includes('X'), true)
})

Deno.test('buildRankingMessageFrom - should handle zero points', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: 0 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('0'), true)
})

Deno.test('buildRankingMessageFrom - should handle negative points', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: -5 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('-5'), true)
})

Deno.test('buildRankingMessageFrom - should handle large point values', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: 999999 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('999999'), true)
})

Deno.test('buildRankingMessageFrom - should handle very long names', () => {
  const ranking = [
    { id: 1, name: 'AVeryLongPlayerNameThatCouldCauseFormattingIssues', total: 100 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('AVeryLongPlayerNameThatCouldCauseFormattingIssues'), true)
})

Deno.test('buildRankingMessageFrom - should use monospace formatting', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: 100 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(result.text.includes('```'), true)
  assertEquals(result.text.includes('Pos  Nom            Punts'), true)
  assertEquals(result.text.includes('—————————————————————————'), true)
})

Deno.test('buildRankingMessageFrom - should handle exactly 10 players', () => {
  const ranking = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    name: `Player${i + 1}`,
    total: 100 - (i * 5)
  }))
  
  const result = buildRankingMessageFrom(ranking)
  
  // Should include medals for top 3
  assertEquals(result.text.includes('🥇'), true)
  assertEquals(result.text.includes('🥈'), true)
  assertEquals(result.text.includes('🥉'), true)
  
  // Should include numeric positions for others
  assertEquals(result.text.includes('Player4'), true)
  assertEquals(result.text.includes('Player10'), true)
})

Deno.test('buildRankingMessageFrom - should return FormattedMessage interface', () => {
  const ranking = [
    { id: 1, name: 'Player1', total: 100 }
  ]
  
  const result = buildRankingMessageFrom(ranking)
  assertEquals(typeof result.text, 'string')
  assertEquals(result.parse_mode, 'Markdown')
  assertEquals(typeof result, 'object')
})