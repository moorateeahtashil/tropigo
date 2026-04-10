'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Clock, MapPin } from 'lucide-react'

interface ItineraryStep {
  time: string
  title: string
  description: string
  photo_url: string
  duration_minutes: string
}

interface ItineraryBuilderProps {
  initialValue?: string
  name?: string
}

export function ItineraryBuilder({ initialValue, name }: ItineraryBuilderProps) {
  let defaultSteps: ItineraryStep[] = []
  try {
    const parsed = initialValue ? JSON.parse(initialValue) : []
    if (Array.isArray(parsed)) {
      defaultSteps = parsed.map((s: any) => ({
        time: s.time || '',
        title: s.title || '',
        description: s.description || '',
        photo_url: s.photo_url || '',
        duration_minutes: String(s.duration_minutes || ''),
      }))
    }
  } catch { /* ignore */ }

  if (defaultSteps.length === 0) {
    defaultSteps = [
      { time: '', title: '', description: '', photo_url: '', duration_minutes: '' },
    ]
  }

  const [steps, setSteps] = useState<ItineraryStep[]>(defaultSteps)
  const [openStep, setOpenStep] = useState<number | null>(0)

  const updateStep = (index: number, field: keyof ItineraryStep, value: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const addStep = () => {
    setSteps(prev => [...prev, { time: '', title: '', description: '', photo_url: '', duration_minutes: '' }])
    setOpenStep(steps.length)
  }

  const removeStep = (index: number) => {
    if (steps.length <= 1) return
    setSteps(prev => prev.filter((_, i) => i !== index))
    if (openStep === index) setOpenStep(null)
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= steps.length) return
    setSteps(prev => {
      const arr = [...prev]
      ;[arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]]
      return arr
    })
  }

  return (
    <div className="space-y-4">
      {/* Hidden field that submits the JSON */}
      <input type="hidden" name={name} value={JSON.stringify(steps)} />

      {steps.map((step, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpenStep(openStep === index ? null : index)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpenStep(openStep === index ? null : index) }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {step.title || `Stop ${index + 1}`}
              </p>
              <p className="text-xs text-gray-500">
                {step.time || 'No time set'} {step.duration_minutes ? `· ${step.duration_minutes} min` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); moveStep(index, 'up') }}
                disabled={index === 0}
                className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); moveStep(index, 'down') }}
                disabled={index === steps.length - 1}
                className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeStep(index) }}
                disabled={steps.length <= 1}
                className="rounded p-1 text-gray-400 hover:text-red-500 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <GripVertical className="h-4 w-4 text-gray-300" />
            </div>
          </div>

          {/* Expandable content */}
          {openStep === index && (
            <div className="border-t border-gray-200 px-4 py-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <Clock className="inline h-3.5 w-3.5 mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={step.time}
                    onChange={e => updateStep(index, 'time', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={step.duration_minutes}
                    onChange={e => updateStep(index, 'duration_minutes', e.target.value)}
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  Title
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={e => updateStep(index, 'title', e.target.value)}
                  placeholder="e.g., Hotel Pickup, Grand Bassin"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={step.description}
                  onChange={e => updateStep(index, 'description', e.target.value)}
                  rows={2}
                  placeholder="What happens at this stop..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Photo URL (optional)
                </label>
                <input
                  type="text"
                  value={step.photo_url}
                  onChange={e => updateStep(index, 'photo_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addStep}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add another stop
      </button>
    </div>
  )
}
