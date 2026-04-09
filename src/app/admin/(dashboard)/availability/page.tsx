'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, Save, Clock, Calendar, Check, X } from 'lucide-react'

interface ActivityOption {
  id: string
  title: string
  product_type: string
}

interface TimeSlot {
  id: string
  time: string
  max_participants: number
}

interface AvailabilityDay {
  id: string
  date: string
  is_available: boolean
  time_slots: TimeSlot[]
}

export default function AdminAvailabilityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityOption[]>([])
  const [selectedActivity, setSelectedActivity] = useState('')
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Load activities
  useEffect(() => {
    fetch('/api/admin/activities')
      .then(res => res.json())
      .then(data => setActivities(data || []))
      .catch(console.error)
  }, [])

  // Load availability when activity selected
  useEffect(() => {
    if (!selectedActivity) return
    setLoading(true)
    fetch(`/api/admin/availability?productId=${selectedActivity}`)
      .then(res => res.json())
      .then(data => {
        setAvailabilityDays(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedActivity])

  const addDay = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const newDay: AvailabilityDay = {
      id: `new-${Date.now()}`,
      date: tomorrow.toISOString().split('T')[0],
      is_available: true,
      time_slots: [
        { id: `slot-${Date.now()}`, time: '09:00', max_participants: 10 },
      ],
    }
    setAvailabilityDays([...availabilityDays, newDay])
  }

  const removeDay = (id: string) => {
    setAvailabilityDays(availabilityDays.filter(d => d.id !== id))
  }

  const updateDay = (id: string, updates: Partial<AvailabilityDay>) => {
    setAvailabilityDays(availabilityDays.map(d => d.id === id ? { ...d, ...updates } : d))
  }

  const addTimeSlot = (dayId: string) => {
    setAvailabilityDays(availabilityDays.map(d => {
      if (d.id !== dayId) return d
      const newSlot: TimeSlot = {
        id: `slot-${Date.now()}`,
        time: '10:00',
        max_participants: 10,
      }
      return { ...d, time_slots: [...d.time_slots, newSlot] }
    }))
  }

  const removeTimeSlot = (dayId: string, slotId: string) => {
    setAvailabilityDays(availabilityDays.map(d => {
      if (d.id !== dayId) return d
      return { ...d, time_slots: d.time_slots.filter(s => s.id !== slotId) }
    }))
  }

  const updateTimeSlot = (dayId: string, slotId: string, updates: Partial<TimeSlot>) => {
    setAvailabilityDays(availabilityDays.map(d => {
      if (d.id !== dayId) return d
      return {
        ...d,
        time_slots: d.time_slots.map(s => s.id === slotId ? { ...s, ...updates } : s),
      }
    }))
  }

  const saveAvailability = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedActivity,
          availability: availabilityDays,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save availability:', err)
    } finally {
      setSaving(false)
    }
  }

  const activityOptions = activities
    .filter(a => a.product_type === 'activity')
    .map(a => ({ value: a.id, label: a.title }))

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="rounded-lg p-2 hover:bg-surface-container">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="heading-display text-3xl text-primary">Manage Availability</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Set available dates and times for activities
            </p>
          </div>
        </div>

        {/* Activity Selector */}
        <div className="mb-8 max-w-md">
          <label className="mb-2 block text-sm font-medium text-on-surface">Select Activity</label>
          <select
            value={selectedActivity}
            onChange={e => setSelectedActivity(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
          >
            <option value="">Choose an activity...</option>
            {activityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {!selectedActivity ? (
          <div className="py-20 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-on-surface-variant/30" />
            <h3 className="text-xl font-semibold text-primary">Select an Activity</h3>
            <p className="mt-2 text-on-surface-variant">Choose an activity to manage its availability schedule.</p>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-2xl bg-surface-container" />
            <div className="h-32 animate-pulse rounded-2xl bg-surface-container" />
          </div>
        ) : (
          <>
            {/* Success Message */}
            {success && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                <Check className="h-5 w-5" />
                Availability saved successfully!
              </div>
            )}

            {/* Availability Days */}
            <div className="space-y-4">
              {availabilityDays.map(day => (
                <div key={day.id} className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-card">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <input
                        type="date"
                        value={day.date}
                        onChange={e => updateDay(day.id, { date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="rounded-lg border border-outline-variant px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={day.is_available}
                          onChange={e => updateDay(day.id, { is_available: e.target.checked })}
                          className="rounded border-outline-variant text-secondary focus:ring-secondary"
                        />
                        <span className="text-on-surface-variant">Available</span>
                      </label>
                      <button
                        onClick={() => removeDay(day.id)}
                        className="rounded-lg p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Time Slots */}
                  {day.is_available && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-primary">
                          <Clock className="h-4 w-4" />
                          Time Slots
                        </h4>
                        <button
                          onClick={() => addTimeSlot(day.id)}
                          className="flex items-center gap-1 rounded-lg bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-secondary/20"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Time
                        </button>
                      </div>

                      <div className="space-y-2">
                        {day.time_slots.map(slot => (
                          <div key={slot.id} className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-3">
                            <input
                              type="time"
                              value={slot.time}
                              onChange={e => updateTimeSlot(day.id, slot.id, { time: e.target.value })}
                              className="rounded-lg border border-outline-variant px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-on-surface-variant">Max</span>
                              <input
                                type="number"
                                value={slot.max_participants}
                                onChange={e => updateTimeSlot(day.id, slot.id, { max_participants: parseInt(e.target.value) || 1 })}
                                min={1}
                                className="w-20 rounded-lg border border-outline-variant px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                              />
                              <span className="text-xs text-on-surface-variant">spots</span>
                            </div>
                            <button
                              onClick={() => removeTimeSlot(day.id, slot.id)}
                              className="ml-auto rounded-lg p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={addDay}
                className="flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-5 py-3 text-sm font-medium text-on-surface hover:border-secondary hover:text-secondary"
              >
                <Plus className="h-4 w-4" />
                Add Date
              </button>
              <Button
                onClick={saveAvailability}
                disabled={saving || availabilityDays.length === 0}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Availability'}
              </Button>
            </div>
          </>
        )}
      </div>
  )
}
