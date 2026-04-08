'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AvailabilityCalendarProps {
  productId: string
  selectedDate?: string
  selectedTime?: string
  onSelect?: (date: string, time: string) => void
  className?: string
}

interface AvailabilitySlot {
  date: string
  available: boolean
  maxParticipants?: number
  remainingSpots?: number
}

interface TimeSlot {
  time: string
  available: boolean
}

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
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({})
  const [loading, setLoading] = useState(false)

  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.year, currentMonth.month + 1, 0).getDate()
  }, [currentMonth])

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentMonth.year, currentMonth.month, 1).getDay()
  }, [currentMonth])

  const monthName = useMemo(() => {
    return new Date(currentMonth.year, currentMonth.month).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })
  }, [currentMonth])

  // Fetch availability when month changes
  const fetchAvailability = async (year: number, month: number) => {
    setLoading(true)
    try {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)
      const res = await fetch(
        `/api/availability/check?productId=${productId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
      )
      if (res.ok) {
        const data = await res.json()
        setAvailability(data.slots || {})
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err)
    } finally {
      setLoading(false)
    }
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; isPast: boolean; isToday: boolean }> = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(currentMonth.year, currentMonth.month, -i)
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        isCurrentMonth: false,
        isPast: date < today,
        isToday: date.toDateString() === today.toDateString(),
      })
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.year, currentMonth.month, day)
      days.push({
        date: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: true,
        isPast: date < today,
        isToday: date.toDateString() === today.toDateString(),
      })
    }

    // Next month padding
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentMonth.year, currentMonth.month + 1, i)
      days.push({
        date: date.toISOString().split('T')[0],
        day: i,
        isCurrentMonth: false,
        isPast: date < today,
        isToday: date.toDateString() === today.toDateString(),
      })
    }

    return days
  }, [currentMonth, daysInMonth, firstDayOfMonth])

  function handleDateClick(date: string, isPast: boolean) {
    if (isPast) return
    const slots = availability[date] || []
    if (slots.length > 0) {
      const firstAvailable = slots.find((s) => s.available)
      if (firstAvailable) {
        onSelect?.(date, firstAvailable.time)
      }
    } else {
      // Default to selecting date without time
      onSelect?.(date, '')
    }
  }

  function goToPrevMonth() {
    const newMonth =
      currentMonth.month === 0
        ? { year: currentMonth.year - 1, month: 11 }
        : { year: currentMonth.year, month: currentMonth.month - 1 }
    setCurrentMonth(newMonth)
    fetchAvailability(newMonth.year, newMonth.month)
  }

  function goToNextMonth() {
    const newMonth =
      currentMonth.month === 11
        ? { year: currentMonth.year + 1, month: 0 }
        : { year: currentMonth.year, month: currentMonth.month + 1 }
    setCurrentMonth(newMonth)
    fetchAvailability(newMonth.year, newMonth.month)
  }

  return (
    <div className={cn('rounded-xl border border-sand-200 bg-white p-4', className)}>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-sand-50"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-sm font-semibold text-ink">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-sand-50"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-ink-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => {
          const isSelected = dayInfo.date === selectedDate
          const hasAvailability = availability[dayInfo.date]?.some((s) => s.available)
          const isPastOrFuture = dayInfo.isPast

          return (
            <button
              key={index}
              onClick={() => handleDateClick(dayInfo.date, dayInfo.isPast)}
              disabled={isPastOrFuture}
              className={cn(
                'relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors',
                !dayInfo.isCurrentMonth && 'text-ink-muted opacity-50',
                dayInfo.isToday && 'ring-1 ring-brand-500',
                isSelected && 'bg-brand-700 font-semibold text-white',
                isPastOrFuture && 'cursor-not-allowed opacity-40',
                !isSelected && dayInfo.isCurrentMonth && !isPastOrFuture && 'hover:bg-sand-50',
              )}
            >
              {dayInfo.day}
              {hasAvailability && !isSelected && dayInfo.isCurrentMonth && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-brand-700" />
          <span>Selected</span>
        </div>
      </div>

      {/* Time slots for selected date */}
      {selectedDate && availability[selectedDate] && availability[selectedDate].length > 0 && (
        <div className="mt-4 border-t border-sand-200 pt-3">
          <h4 className="mb-2 text-sm font-medium text-ink">Available Times</h4>
          <div className="flex flex-wrap gap-2">
            {availability[selectedDate].map((slot) => (
              <button
                key={slot.time}
                onClick={() => onSelect?.(selectedDate, slot.time)}
                disabled={!slot.available}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  slot.time === selectedTime
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : slot.available
                    ? 'border-sand-200 text-ink-secondary hover:border-brand-300 hover:bg-sand-50'
                    : 'border-sand-100 text-ink-muted opacity-50',
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
