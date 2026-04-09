'use client'

import { useState } from 'react'
import { Plus, Trash2, Clock, Calendar } from 'lucide-react'

interface Schedule {
  id: string
  day_of_week: number
  start_time: string
  max_capacity: number
  is_active: boolean
}

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

interface TripScheduleProps {
  tripId: string
  initialSchedules: Schedule[]
}

export function TripScheduleManager({ tripId, initialSchedules }: TripScheduleProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const addSchedule = () => {
    setSchedules(prev => [...prev, {
      id: `new-${Date.now()}`,
      day_of_week: 1,
      start_time: '08:00',
      max_capacity: 6,
      is_active: true,
    }])
  }

  const removeSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id))
  }

  const updateSchedule = (id: string, field: keyof Schedule, value: any) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const saveSchedules = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/trips/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, schedules }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12">
          <Calendar className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No schedule set yet</p>
          <button
            type="button"
            onClick={addSchedule}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Add departure schedule
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {schedules.map((schedule, index) => (
              <div key={schedule.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                <select
                  value={schedule.day_of_week}
                  onChange={e => updateSchedule(schedule.id, 'day_of_week', Number(e.target.value))}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {DAYS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={schedule.start_time}
                    onChange={e => updateSchedule(schedule.id, 'start_time', e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Max</span>
                  <input
                    type="number"
                    value={schedule.max_capacity}
                    min={1}
                    onChange={e => updateSchedule(schedule.id, 'max_capacity', Number(e.target.value))}
                    className="w-16 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={schedule.is_active}
                    onChange={e => updateSchedule(schedule.id, 'is_active', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Active
                </label>

                <button
                  type="button"
                  onClick={() => removeSchedule(schedule.id)}
                  className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addSchedule}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Add another departure
            </button>

            <button
              type="button"
              onClick={saveSchedules}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Schedule'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
