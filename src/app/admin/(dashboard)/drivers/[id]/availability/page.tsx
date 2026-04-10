'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Slot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string | null
  is_available: boolean
}

interface NewSlotForm {
  day_of_week: number
  start_time: string
  end_time: string
}

export default function DriverAvailabilityPage() {
  const params = useParams()
  const driverId = params.id as string

  const [driver, setDriver] = useState<{ first_name: string; last_name: string } | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null) // tracks which row is saving
  const [addingDay, setAddingDay] = useState<number | null>(null) // which day is open for adding
  const [form, setForm] = useState<NewSlotForm>({ day_of_week: 1, start_time: '07:00', end_time: '18:00' })

  useEffect(() => {
    loadDriver()
    loadSlots()
  }, [driverId])

  async function loadDriver() {
    const res = await fetch(`/api/admin/drivers?id=${driverId}`)
    if (res.ok) setDriver(await res.json())
  }

  async function loadSlots() {
    setLoading(true)
    const res = await fetch(`/api/admin/drivers/${driverId}/availability`)
    if (res.ok) setSlots(await res.json())
    setLoading(false)
  }

  async function addSlot() {
    if (saving) return
    setSaving('new')
    const res = await fetch(`/api/admin/drivers/${driverId}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day_of_week: form.day_of_week,
        start_time: form.start_time,
        end_time: form.end_time || null,
      }),
    })
    if (res.ok) {
      setAddingDay(null)
      await loadSlots()
    }
    setSaving(null)
  }

  async function deleteSlot(id: string) {
    setSaving(id)
    await fetch(`/api/admin/drivers/${driverId}/availability?id=${id}`, { method: 'DELETE' })
    setSlots(prev => prev.filter(s => s.id !== id))
    setSaving(null)
  }

  // Group slots by day
  const slotsByDay: Record<number, Slot[]> = {}
  slots.forEach(s => {
    if (!slotsByDay[s.day_of_week]) slotsByDay[s.day_of_week] = []
    slotsByDay[s.day_of_week].push(s)
  })

  const totalActiveDays = Object.keys(slotsByDay).length

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/drivers" className="rounded-lg p-2 text-ink-secondary hover:bg-sand-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {driver ? `${driver.first_name} ${driver.last_name}` : 'Driver'} — Weekly Schedule
          </h1>
          <p className="mt-0.5 text-sm text-ink-secondary">
            Set which days and hours this driver is available each week. Trip slots are available when the trip is scheduled AND a driver is available.
          </p>
        </div>
      </div>

      {/* Summary pill */}
      {!loading && (
        <div className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-4 py-3 shadow-card text-sm">
          {totalActiveDays > 0 ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <span className="text-ink">Available on <strong>{totalActiveDays}</strong> day{totalActiveDays !== 1 ? 's' : ''} per week</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span className="text-ink-secondary">No weekly availability set — driver won't be matched to any trips</span>
            </>
          )}
        </div>
      )}

      {/* Weekly grid */}
      <div className="rounded-2xl border border-sand-200 bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-sand-100" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-sand-100">
            {DAY_NAMES.map((dayName, dow) => {
              const daySlots = slotsByDay[dow] || []
              const isAddingThis = addingDay === dow

              return (
                <div key={dow} className="px-5 py-4">
                  {/* Day row */}
                  <div className="flex items-center gap-3">
                    {/* Day name */}
                    <span className="w-28 text-sm font-semibold text-ink shrink-0">{dayName}</span>

                    {/* Existing slots */}
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                      {daySlots.length === 0 && !isAddingThis && (
                        <span className="text-xs text-ink-muted">— no availability</span>
                      )}
                      {daySlots.map(slot => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800"
                        >
                          <Clock className="h-3 w-3" />
                          <span>{slot.start_time}{slot.end_time ? ` – ${slot.end_time}` : ''}</span>
                          <button
                            onClick={() => deleteSlot(slot.id)}
                            disabled={saving === slot.id}
                            className="ml-1 rounded p-0.5 text-green-600 hover:bg-green-100 hover:text-red-500 disabled:opacity-40"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {/* Inline add form */}
                      {isAddingThis && (
                        <div className="flex items-center gap-2 rounded-xl border border-sand-200 bg-sand-50 px-3 py-2">
                          <input
                            type="time"
                            value={form.start_time}
                            onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                            className="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs text-ink focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                          />
                          <span className="text-xs text-ink-muted">to</span>
                          <input
                            type="time"
                            value={form.end_time}
                            onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                            className="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs text-ink focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                          />
                          <button
                            onClick={addSlot}
                            disabled={saving === 'new'}
                            className="rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-white hover:bg-secondary/90 disabled:opacity-50"
                          >
                            {saving === 'new' ? '…' : 'Add'}
                          </button>
                          <button
                            onClick={() => setAddingDay(null)}
                            className="rounded-lg px-2 py-1 text-xs text-ink-secondary hover:bg-sand-100"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Add button */}
                    {!isAddingThis && (
                      <button
                        onClick={() => {
                          setForm(f => ({ ...f, day_of_week: dow }))
                          setAddingDay(dow)
                        }}
                        className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-secondary hover:bg-sand-100 hover:text-ink"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add slot
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-ink-muted px-1">
        A trip departure is bookable when the trip is scheduled for that day AND at least one active driver has availability covering that departure time. If no drivers are configured, trips fall back to schedule-only availability.
      </p>
    </div>
  )
}
