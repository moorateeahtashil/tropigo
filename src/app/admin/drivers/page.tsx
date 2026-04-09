'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Check, User, Phone, Mail, Car } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Driver {
  id: string
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  vehicle_type: string | null
  license_plate: string | null
  is_active: boolean
}

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newDriver, setNewDriver] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    vehicle_type: 'sedan',
    license_plate: '',
    is_active: true,
  })

  useEffect(() => {
    loadDrivers()
  }, [])

  async function loadDrivers() {
    try {
      const res = await fetch('/api/admin/drivers')
      const data = await res.json()
      setDrivers(data || [])
    } catch (err) {
      console.error('Failed to load drivers:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveDriver(id?: string) {
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/admin/drivers', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id, ...form } : form),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess(true)
      setNewDriver(false)
      setEditingId(null)
      loadDrivers()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save driver:', err)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await fetch('/api/admin/drivers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !current }),
      })
      loadDrivers()
    } catch (err) {
      console.error('Failed to toggle driver:', err)
    }
  }

  async function deleteDriver(id: string) {
    if (!confirm('Delete this driver?')) return
    try {
      await fetch(`/api/admin/drivers?id=${id}`, { method: 'DELETE' })
      loadDrivers()
    } catch (err) {
      console.error('Failed to delete driver:', err)
    }
  }

  function startEdit(driver: Driver) {
    setEditingId(driver.id)
    setForm({
      first_name: driver.first_name,
      last_name: driver.last_name,
      phone: driver.phone || '',
      email: driver.email || '',
      vehicle_type: driver.vehicle_type || 'sedan',
      license_plate: driver.license_plate || '',
      is_active: driver.is_active,
    })
  }

  function startNew() {
    setNewDriver(true)
    setEditingId(null)
    setForm({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      vehicle_type: 'sedan',
      license_plate: '',
      is_active: true,
    })
  }

  const vehicleOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'minivan', label: 'Minivan' },
    { value: 'bus', label: 'Bus' },
    { value: 'luxury', label: 'Luxury' },
  ]

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="rounded-lg p-2 hover:bg-surface-container">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="heading-display text-3xl text-primary">Manage Drivers</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Add and manage drivers for transfers and activities
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <Check className="h-5 w-5" />
            Driver saved successfully!
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <Button onClick={startNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Driver
          </Button>
        </div>

        {/* New/Edit Form */}
        {(newDriver || editingId) && (
          <div className="mb-8 rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-primary">
              {newDriver ? 'New Driver' : 'Edit Driver'}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                required
              />
              <Input
                label="Last Name"
                value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink">Vehicle Type</label>
                <select
                  value={form.vehicle_type}
                  onChange={e => setForm(f => ({ ...f, vehicle_type: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  {vehicleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="License Plate"
                value={form.license_plate}
                onChange={e => setForm(f => ({ ...f, license_plate: e.target.value }))}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => saveDriver(editingId || undefined)} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Driver'}
              </Button>
              <Button variant="outline" onClick={() => { setNewDriver(false); setEditingId(null) }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Driver List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-container" />
            ))}
          </div>
        ) : drivers.length === 0 ? (
          <div className="py-16 text-center">
            <User className="mx-auto mb-4 h-16 w-16 text-on-surface-variant/30" />
            <h3 className="text-xl font-semibold text-primary">No drivers yet</h3>
            <p className="mt-2 text-on-surface-variant">Add your first driver to start managing availability.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {drivers.map(driver => (
              <div key={driver.id} className="flex items-center justify-between rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                    <User className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink">
                      {driver.first_name} {driver.last_name}
                      {!driver.is_active && (
                        <span className="ml-2 rounded-full bg-surface-container px-2 py-0.5 text-xs text-on-surface-variant">Inactive</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                      {driver.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {driver.phone}
                        </span>
                      )}
                      {driver.vehicle_type && (
                        <span className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          {driver.vehicle_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/drivers/${driver.id}/availability`}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/5"
                  >
                    Manage Availability
                  </Link>
                  <button
                    onClick={() => startEdit(driver)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(driver.id, driver.is_active)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      driver.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {driver.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteDriver(driver.id)}
                    className="rounded-lg p-2 text-on-surface-variant hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
