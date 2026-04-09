'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Check, Calendar, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'

interface DriverSlot {
  id: string
  available_date: string
  start_time: string
  end_time: string | null
  product_id: string | null
  product_title: string | null
  is_available: boolean
}

export default function AdminDriverAvailabilityPage() {
  const params = useParams()
  const router = useRouter()
  const driverId = params.id as string
  const [driver, setDriver] = useState<any>(null)
  const [slots, setSlots] = useState<DriverSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [newSlot, setNewSlot] = useState(false)
  const [form, setForm] = useState({
    available_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '' as string | null,
    product_id: '',
  })

  useEffect(() => {
    loadDriver()
    loadSlots()
  }, [driverId])

  async function loadDriver() {
    try {
      const res = await fetch(`/api/admin/drivers?id=${driverId}`)
      const data = await res.json()
      setDriver(data)
    } catch (err) {
      console.error('Failed to load driver:', err)
    }
  }

  async function loadSlots() {
    try {
      const res = await fetch(`/api/admin/drivers/${driverId}/availability`)
      const data = await res.json()
      setSlots(data || [])
    } catch (err) {
      console.error('Failed to load slots:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addSlot() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/drivers/${driverId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to add slot')
      setNewSlot(false)
      setForm({
        available_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '17:00',
        product_id: '',
      })
      loadSlots()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to add slot:', err)
    } finally {
      setSaving(false)
    }
  }

  async function deleteSlot(id: string) {
    try {
      await fetch(`/api/admin/drivers/${driverId}/availability?id=${id}`, { method: 'DELETE' })
      loadSlots()
    } catch (err) {
      console.error('Failed to delete slot:', err)
    }
  }

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.available_date]) acc[slot.available_date] = []
    acc[slot.available_date].push(slot)
    return acc
  }, {} as Record<string, DriverSlot[]>)

  const sortedDates = Object.keys(slotsByDate).sort()

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/drivers" className="rounded-lg p-2 hover:bg-surface-container">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="heading-display text-3xl text-primary">
              {driver ? `${driver.first_name} ${driver.last_name}` : 'Driver'} Availability
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Set available dates and time slots for this driver
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <Check className="h-5 w-5" />
            Slot added successfully!
          </div>
        )}

        {/* Add New Slot */}
        <div className="mb-6">
          <Button onClick={() => setNewSlot(!newSlot)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Time Slot
          </Button>
        </div>

        {newSlot && (
          <div className="mb-8 rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-primary">New Availability Slot</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Date</label>
                <input
                  type="date"
                  value={form.available_date}
                  onChange={e => setForm(f => ({ ...f, available_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Start Time</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">End Time (optional)</label>
                <input
                  type="time"
                  value={form.end_time || ''}
                  onChange={e => setForm(f => ({ ...f, end_time: e.target.value || null }))}
                  className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addSlot} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Add Slot'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Slots by Date */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-container" />
            ))}
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-on-surface-variant/30" />
            <h3 className="text-xl font-semibold text-primary">No availability set</h3>
            <p className="mt-2 text-on-surface-variant">Add time slots to make this driver available for bookings.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-card">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-primary">
                  <Calendar className="h-5 w-5" />
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {slotsByDate[date].map(slot => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between rounded-xl border p-3 ${
                        slot.is_available
                          ? 'border-green-200 bg-green-50'
                          : 'border-outline-variant/20 bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-on-surface-variant" />
                        <span className="text-sm font-medium text-ink">
                          {slot.start_time}
                          {slot.end_time && ` - ${slot.end_time}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          slot.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {slot.is_available ? 'Available' : 'Booked'}
                        </span>
                        {!slot.is_available && (
                          <button
                            onClick={() => deleteSlot(slot.id)}
                            className="rounded-lg p-1 text-on-surface-variant hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
