import { Temporal } from 'npm:@js-temporal/polyfill'

type Period = 'all' | 'month' | 'day'

const DEFAULT_DATE_RANGE = {
  from: '1970-01-01T00:00:00Z',
  to: '2100-12-31T23:59:59Z',
} as const

export function getDateRangeForPeriod(period: Period): {
  from: string
  to: string
} {
  if (period === 'all') return DEFAULT_DATE_RANGE

  const timezone = 'Europe/Madrid'
  const now = Temporal.Now.zonedDateTimeISO(timezone)

  let start, end

  if (period === 'month') {
    start = now.with({ day: 1 }).startOfDay()

    // End of month: last day at 23:59:59.999999999
    const daysInMonth = now.daysInMonth
    end = now.with({
      day: daysInMonth,
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    })
  } else {
    start = now.startOfDay()

    // End of day: 23:59:59.999999999
    end = now.with({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    })
  }

  return {
    from: start.toInstant().toString(),
    to: end.toInstant().toString(),
  }
}
