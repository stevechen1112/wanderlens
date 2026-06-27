import dayjs from 'dayjs'
import type { ScheduleSlot } from '@/api'

export function normalizeDate(value: unknown): string {
  if (typeof value === 'string') return value.slice(0, 10)
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value
    return dayjs(`${y}-${m}-${d}`).format('YYYY-MM-DD')
  }
  return ''
}

export function formatTimeHour(value?: string): string {
  if (!value) return ''
  return value.slice(0, 5)
}

export function normalizeScheduleSlot(raw: Record<string, unknown>): ScheduleSlot {
  return {
    id: Number(raw.id),
    providerId: Number(raw.providerId),
    scheduleDate: normalizeDate(raw.scheduleDate),
    slotStart: formatTimeHour(raw.slotStart as string),
    slotEnd: formatTimeHour(raw.slotEnd as string),
    active: (raw.active as string) || 'Y',
    lockedByOrderId: raw.lockedByOrderId as number | null | undefined,
  }
}

export const SCHEDULE_HOURS = Array.from({ length: 15 }, (_, i) =>
  `${String(i + 8).padStart(2, '0')}:00`,
)

export function endHourOptions(start: string): string[] {
  return SCHEDULE_HOURS.filter((h) => h > start)
}

export interface TimeRange {
  start: string
  end: string
}

export function buildMondayFirstCalendar(viewMonth: dayjs.Dayjs) {
  const start = viewMonth.startOf('month')
  const end = viewMonth.endOf('month')
  const mondayOffset = (start.day() + 6) % 7
  const days: Array<{ date: string; day: number; inMonth: boolean }> = []

  for (let i = 0; i < mondayOffset; i++) {
    const d = start.subtract(mondayOffset - i, 'day')
    days.push({ date: d.format('YYYY-MM-DD'), day: d.date(), inMonth: false })
  }
  for (let d = 1; d <= end.date(); d++) {
    days.push({
      date: viewMonth.date(d).format('YYYY-MM-DD'),
      day: d,
      inMonth: true,
    })
  }
  let nextDay = 1
  while (days.length % 7 !== 0) {
    const d = end.add(nextDay, 'day')
    days.push({ date: d.format('YYYY-MM-DD'), day: d.date(), inMonth: false })
    nextDay++
  }
  return days
}
