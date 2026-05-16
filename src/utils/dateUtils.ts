import { mangaList } from './mangalist'

// May 1, 2026 = day index 0
export const LAUNCH_DATE = new Date(2026, 4, 1)

export function getDayIndex(date: Date): number {
  const launch = new Date(LAUNCH_DATE.getFullYear(), LAUNCH_DATE.getMonth(), LAUNCH_DATE.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((target.getTime() - launch.getTime()) / (24 * 60 * 60 * 1000))
}

export function getMangaForDay(date: Date): string {
  const idx = getDayIndex(date)
  return mangaList[((idx % mangaList.length) + mangaList.length) % mangaList.length]
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isToday(date: Date): boolean {
  return formatDateKey(date) === formatDateKey(new Date())
}

/** Returns YYYY-MM-DD keys from today back to launch date (descending). */
export function getDaysFromLaunch(): string[] {
  const today = new Date()
  const totalDays = getDayIndex(today)
  const days: string[] = []
  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(
      LAUNCH_DATE.getFullYear(),
      LAUNCH_DATE.getMonth(),
      LAUNCH_DATE.getDate() + i
    )
    days.push(formatDateKey(d))
  }
  return days
}
