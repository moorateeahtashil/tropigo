'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function ToastReader() {
  const searchParams = useSearchParams()
  const toast = searchParams?.get('toast')
  const toastTitle = searchParams?.get('toast_title')
  const toastMsg = searchParams?.get('toast_msg')

  useEffect(() => {
    if (!toast) return
    const detail = {
      type: toast === 'error' ? 'error' : toast === 'warning' ? 'warning' : toast === 'info' ? 'info' : 'success',
      title: toastTitle || (toast === 'error' ? 'Something went wrong' : 'Success'),
      message: toastMsg || undefined,
    }
    window.dispatchEvent(new CustomEvent('toast', { detail }))

    // Clean URL without re-rendering
    const url = new URL(window.location.href)
    url.searchParams.delete('toast')
    url.searchParams.delete('toast_title')
    url.searchParams.delete('toast_msg')
    window.history.replaceState({}, '', url.toString())
  }, [toast, toastTitle, toastMsg])

  return null
}
