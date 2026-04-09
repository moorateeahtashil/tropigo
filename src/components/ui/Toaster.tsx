'use client'

import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <AlertCircle className="h-5 w-5 text-blue-500" />,
}

const BORDERS: Record<ToastType, string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { type: ToastType; title: string; message?: string }
      add(detail.type, detail.title, detail.message)
    }
    window.addEventListener('toast', handler)
    return () => window.removeEventListener('toast', handler)
  }, [add])

  return (
    <>
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-xl border border-sand-200 bg-white p-4 shadow-lg border-l-4 ${BORDERS[toast.type]}`}
            >
              <div className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-xs text-ink-secondary">{toast.message}</p>}
              </div>
              <button onClick={() => remove(toast.id)} className="flex-shrink-0 text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
