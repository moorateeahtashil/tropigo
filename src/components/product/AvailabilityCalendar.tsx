'use client'

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

  // Fetch on mount
  useEffect(() => {
    fetchAvailability(currentMonth.year, currentMonth.month)
  }, [])

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
    const hasAvailable = slots.some(s => s.available)

    // If no availability data, allow selection anyway (default mode)
    if (slots.length === 0) {
      onSelect?.(date, '09:00')
      return
    }

    // If date has available slots, select the first one
    if (hasAvailable) {
      const firstAvailable = slots.find(s => s.available)
      if (firstAvailable) {
        onSelect?.(date, firstAvailable.time)
      }
    }
    // If fully booked, do nothing (button is disabled)
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

  // Get availability status for a date
  const getDayStatus = (date: string) => {
    const slots = availability[date] || []
    if (slots.length === 0) return 'default' // No rules = available
    const hasAvailable = slots.some(s => s.available)
    return hasAvailable ? 'available' : 'unavailable'
  }

  return (
    <div className={cn('rounded-xl border border-outline-variant/20 bg-white p-4', className)}>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-sm font-semibold text-primary">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-on-surface-variant">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => {
          const isSelected = dayInfo.date === selectedDate
          const status = getDayStatus(dayInfo.date)
          const isDisabled = dayInfo.isPast || status === 'unavailable' || !dayInfo.isCurrentMonth

          return (
            <button
              key={index}
              onClick={() => handleDateClick(dayInfo.date, dayInfo.isPast)}
              disabled={isDisabled}
              className={cn(
                'relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-all',
                !dayInfo.isCurrentMonth && 'opacity-20',
                dayInfo.isToday && !isSelected && 'ring-1 ring-secondary',
                isSelected && 'bg-secondary font-semibold text-white shadow-md',
                isDisabled && 'cursor-not-allowed opacity-30',
                !isSelected && dayInfo.isCurrentMonth && !dayInfo.isPast && status !== 'unavailable' && 'hover:bg-surface-container cursor-pointer',
                status === 'available' && !isSelected && dayInfo.isCurrentMonth && 'text-green-700 font-semibold',
                status === 'unavailable' && !isSelected && dayInfo.isCurrentMonth && 'text-red-500',
              )}
            >
              {dayInfo.day}
              {/* Green dot for available */}
              {status === 'available' && !isSelected && dayInfo.isCurrentMonth && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-green-500" />
              )}
              {/* Red dot for unavailable */}
              {status === 'unavailable' && dayInfo.isCurrentMonth && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>Unavailable</span>
        </div>
      </div>

      {/* Time slots for selected date - INLINE with calendar */}
      {selectedDate && availability[selectedDate] && availability[selectedDate].length > 0 && (
        <div className="mt-4 border-t border-outline-variant/20 pt-4">
          <h4 className="mb-3 text-sm font-semibold text-primary">
            Select Time for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {availability[selectedDate].map((slot) => (
              <button
                key={slot.time}
                onClick={() => onSelect?.(selectedDate, slot.time)}
                disabled={!slot.available}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                  slot.time === selectedTime
                    ? 'border-secondary bg-secondary text-white shadow-md'
                    : slot.available
                    ? 'border-outline-variant bg-white text-on-surface hover:border-secondary hover:bg-secondary/5'
                    : 'border-outline-variant/20 bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed line-through',
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
