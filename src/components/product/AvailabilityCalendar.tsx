'use client'

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface AvailabilityCalendarProps {
  productId: string
  selectedDate?: string
  selectedTime?: string
  onSelect?: (date: string, time: string) => void
  className?: string
}

interface TimeSlot {
  time: string
  available: boolean
  max_capacity?: number
  booked_count?: number
}

type DayStatus =
  | 'loading'       // fetching
  | 'not-scheduled' // trip doesn't run / no slots at all
  | 'available'     // at least one available slot
  | 'full'          // scheduled but all slots booked / no driver
  | 'past'          // in the past

export function AvailabilityCalendar({
  productId,
  selectedDate,
  selectedTime,
  onSelect,
  className,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  // null = not fetched yet, {} = fetched with results
  const [availability, setAvailability] = useState<Record<string, TimeSlot[] | null> | null>(null)
  const [loading, setLoading] = useState(false)

  const monthLabel = useMemo(() =>
    new Date(currentMonth.year, currentMonth.month).toLocaleString('default', {
      month: 'long', year: 'numeric',
    }),
    [currentMonth],
  )

  const daysInMonth = useMemo(() =>
    new Date(currentMonth.year, currentMonth.month + 1, 0).getDate(),
    [currentMonth],
  )

  const firstDayOfMonth = useMemo(() =>
    new Date(currentMonth.year, currentMonth.month, 1).getDay(),
    [currentMonth],
  )

  async function fetchMonth(year: number, month: number) {
    setLoading(true)
    try {
      const s = new Date(year, month, 1).toISOString().split('T')[0]
      const e = new Date(year, month + 1, 0).toISOString().split('T')[0]
      const res = await fetch(`/api/availability/check?productId=${productId}&startDate=${s}&endDate=${e}`)
      if (res.ok) {
        const data = await res.json()
        setAvailability(data.slots ?? {})
      }
    } catch {
      setAvailability({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMonth(currentMonth.year, currentMonth.month)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function prevMonth() {
    const nm = currentMonth.month === 0
      ? { year: currentMonth.year - 1, month: 11 }
      : { year: currentMonth.year, month: currentMonth.month - 1 }
    setCurrentMonth(nm)
    fetchMonth(nm.year, nm.month)
  }

  function nextMonth() {
    const nm = currentMonth.month === 11
      ? { year: currentMonth.year + 1, month: 0 }
      : { year: currentMonth.year, month: currentMonth.month + 1 }
    setCurrentMonth(nm)
    fetchMonth(nm.year, nm.month)
  }

  // Calendar grid
  const calendarDays = useMemo(() => {
    const days: Array<{
      date: string
      day: number
      isCurrentMonth: boolean
      isPast: boolean
      isToday: boolean
    }> = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = new Date(currentMonth.year, currentMonth.month, -i)
      days.push({ date: d.toISOString().split('T')[0], day: d.getDate(), isCurrentMonth: false, isPast: d < today, isToday: false })
    }
    for (let n = 1; n <= daysInMonth; n++) {
      const d = new Date(currentMonth.year, currentMonth.month, n)
      days.push({ date: d.toISOString().split('T')[0], day: n, isCurrentMonth: true, isPast: d < today, isToday: d.toDateString() === today.toDateString() })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentMonth.year, currentMonth.month + 1, i)
      days.push({ date: d.toISOString().split('T')[0], day: i, isCurrentMonth: false, isPast: d < today, isToday: false })
    }
    return days
  }, [currentMonth, daysInMonth, firstDayOfMonth])

  function getDayStatus(date: string, isPast: boolean, isCurrentMonth: boolean): DayStatus {
    if (!isCurrentMonth) return 'not-scheduled'
    if (isPast) return 'past'
    if (loading || availability === null) return 'loading'
    const slots = availability[date]
    if (slots === undefined || slots === null || slots.length === 0) return 'not-scheduled'
    return slots.some(s => s.available) ? 'available' : 'full'
  }

  function handleDateClick(date: string, status: DayStatus) {
    if (status !== 'available') return
    const slots = availability?.[date] ?? []
    const first = slots.find(s => s.available)
    if (first) onSelect?.(date, first.time)
  }

  const selectedSlots = selectedDate ? (availability?.[selectedDate] ?? []) : []

  return (
    <div className={cn('rounded-xl border border-outline-variant/20 bg-white p-4', className)}>
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container" aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
          {monthLabel}
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />}
        </h3>
        <button onClick={nextMonth} className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container" aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-xs font-medium text-on-surface-variant">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const status = getDayStatus(day.date, day.isPast, day.isCurrentMonth)
          const isSelected = day.date === selectedDate
          const isClickable = status === 'available'

          return (
            <button
              key={i}
              onClick={() => handleDateClick(day.date, status)}
              disabled={!isClickable}
              className={cn(
                'relative flex h-9 w-full flex-col items-center justify-center rounded-lg text-sm transition-all',
                // Fade out-of-month days
                !day.isCurrentMonth && 'opacity-0 pointer-events-none',
                // Today ring
                day.isToday && !isSelected && 'ring-1 ring-secondary',
                // Selected
                isSelected && 'bg-secondary font-semibold text-white shadow-md',
                // Available — clickable
                isClickable && !isSelected && 'cursor-pointer text-on-surface hover:bg-surface-container',
                // Fully booked — muted with line-through
                status === 'full' && !isSelected && 'cursor-not-allowed text-on-surface-variant/50',
                // Not scheduled — very faint
                status === 'not-scheduled' && day.isCurrentMonth && 'cursor-not-allowed text-on-surface-variant/30',
                // Past
                status === 'past' && 'cursor-not-allowed text-on-surface-variant/30',
              )}
            >
              <span className={cn(status === 'full' && !isSelected && 'line-through')}>
                {day.day}
              </span>
              {/* Dots — only for current month, non-past */}
              {!isSelected && day.isCurrentMonth && status === 'available' && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-green-500" />
              )}
              {!isSelected && day.isCurrentMonth && status === 'full' && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Fully booked
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-outline-variant/40" />
          Not scheduled
        </div>
      </div>

      {/* Time slots for selected date */}
      {selectedDate && selectedSlots.length > 0 && (
        <div className="mt-4 border-t border-outline-variant/20 pt-4">
          <h4 className="mb-3 text-sm font-semibold text-primary">
            Select departure time —{' '}
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {selectedSlots.map(slot => {
              const isChosen = slot.time === selectedTime
              const spotsLeft = slot.max_capacity != null
                ? slot.max_capacity - (slot.booked_count ?? 0)
                : null

              return (
                <button
                  key={slot.time}
                  onClick={() => slot.available && onSelect?.(selectedDate, slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-left transition-all',
                    isChosen
                      ? 'border-secondary bg-secondary text-white shadow-md'
                      : slot.available
                      ? 'border-outline-variant bg-white text-on-surface hover:border-secondary hover:bg-secondary/5'
                      : 'cursor-not-allowed border-outline-variant/20 bg-surface-container text-on-surface-variant/40',
                  )}
                >
                  <p className={cn('text-sm font-semibold', !slot.available && 'line-through')}>{slot.time}</p>
                  {spotsLeft != null && (
                    <p className={cn('text-xs mt-0.5', isChosen ? 'text-white/80' : slot.available ? 'text-on-surface-variant' : 'text-on-surface-variant/40')}>
                      {slot.available ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
