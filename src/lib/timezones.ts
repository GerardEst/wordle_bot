type Period = 'all' | 'month' | 'day'

const DEFAULT_DATE_RANGE = {
  from: '1970-01-01T00:00:00Z',
  to: '2100-12-31T23:59:59Z',
} as const

const HOURS_IN_MS = 60 * 60 * 1000

/**
 * Calculates date range for the given period in Spain timezone
 */
export function getDateRangeForPeriod(period: Period): {
  from: string
  to: string
} {
  if (period === 'all') {
    return DEFAULT_DATE_RANGE
  }

  const utcNow = new Date()
  const spainOffsetHours = getSpainTimezoneOffset()

  if (period === 'month') {
    return getSpainMonthRange(utcNow, spainOffsetHours)
  }

  if (period === 'day') {
    return getSpainDayRange(utcNow, spainOffsetHours)
  }

  return DEFAULT_DATE_RANGE
}

/**
 * Gets Spain timezone offset in hours (1 for winter, 2 for summer)
 * Preserves the original DST detection logic
 */
function getSpainTimezoneOffset(): number {
  return isSummerTime() ? 2 : 1
}

function isSummerTime() {
  const now = new Date()
  // Get the timezone offset for Spain at the current time
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'longOffset',
  })
  const parts = formatter.formatToParts(now)
  const offset = parts.find((part) => part.type === 'timeZoneName')?.value

  // Summer time: GMT+02:00, Winter time: GMT+01:00
  return offset === 'GMT+02:00'
}

/**
 * Calculates the current month range in Spain timezone, converted to UTC
 * Preserves the original month calculation logic
 */
function getSpainMonthRange(
  utcNow: Date,
  offsetHours: number
): { from: string; to: string } {
  const offsetMs = offsetHours * HOURS_IN_MS

  // Convert UTC to Spain time
  const spainNow = new Date(utcNow.getTime() + offsetMs)

  // Create Spain month boundaries in Spain time
  const startOfSpainMonth = new Date(spainNow)
  startOfSpainMonth.setUTCDate(1)
  startOfSpainMonth.setUTCHours(0, 0, 0, 0) // First day of month at 00:00 Spain time

  const endOfSpainMonth = new Date(spainNow)
  endOfSpainMonth.setUTCMonth(endOfSpainMonth.getUTCMonth() + 1, 0) // Last day of month
  endOfSpainMonth.setUTCHours(23, 59, 59, 999) // 23:59:59.999 Spain time

  // Convert back to UTC for database query
  const from = new Date(startOfSpainMonth.getTime() - offsetMs).toISOString()
  const to = new Date(endOfSpainMonth.getTime() - offsetMs).toISOString()

  return { from, to }
}

/**
 * Calculates the current day range in Spain timezone, converted to UTC
 * Preserves the original day calculation logic
 */
function getSpainDayRange(
  utcNow: Date,
  offsetHours: number
): { from: string; to: string } {
  const offsetMs = offsetHours * HOURS_IN_MS

  // Convert UTC to Spain time
  const spainNow = new Date(utcNow.getTime() + offsetMs)

  // Create Spain day boundaries in Spain time
  const startOfSpainDay = new Date(spainNow)
  startOfSpainDay.setUTCHours(0, 0, 0, 0) // 00:00 Spain time

  const endOfSpainDay = new Date(spainNow)
  endOfSpainDay.setUTCHours(23, 59, 59, 999) // 23:59:59.999 Spain time

  // Convert back to UTC for database query
  const from = new Date(startOfSpainDay.getTime() - offsetMs).toISOString()
  const to = new Date(endOfSpainDay.getTime() - offsetMs).toISOString()

  return { from, to }
}
