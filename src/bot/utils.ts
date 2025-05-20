export function getDaysRemainingInMonth() {
  const avui = new Date()
  const ultimDiaMes = new Date(
    avui.getFullYear(),
    avui.getMonth() + 1,
    0
  ).getDate()
  const diesRestants = ultimDiaMes - avui.getDate()

  return diesRestants
}

export function getCurrentMonth() {
  const now = new Date()
  return now.toLocaleString('default', { month: 'long' })
}

export function getPoints(message: string) {
  const tries = message.split(' ')[2].split('/')[0]

  if (tries === 'X') return 0

  const points = 6 - parseInt(tries)

  return points + 1
}

export function getEmojiReactionFor(points: number) {
  if (points === 0) return '🤡'
  if (points === 1) return '😭'
  if (points === 2) return '😐'
  if (points === 3) return '😎'
  if (points === 4) return '🤯'
  if (points === 5) return '🏆'
  if (points === 6) return '🤨'
  return '🤷'
}
