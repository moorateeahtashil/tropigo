'use client'

import { useState, useRef } from 'react'
import { Upload, Trash2, Star, ImageIcon } from 'lucide-react'

interface MediaItem {
  id: string
  url: string
  alt: string | null
  is_cover: boolean
  sort_order: number
}

interface PhotoManagerProps {
  productId: string
  initialMedia: MediaItem[]
}

export function PhotoManager({
  productId,
  initialMedia,
}: PhotoManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        const formData = new FormData()
        formData.append('productId', productId)
        formData.append('file', file)

        const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Upload failed')
        }
        const data = await res.json()
        setMedia(prev => [...prev, data])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSetCover(mediaId: string) {
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setCover', productId, mediaId }),
    })
    if (res.ok) {
      setMedia(prev => prev.map(m => ({ ...m, is_cover: m.id === mediaId })))
    }
  }

  async function handleDelete(mediaId: string) {
    if (!confirm('Delete this image?')) return
    const res = await fetch(`/api/admin/media?mediaId=${mediaId}&productId=${productId}`, { method: 'DELETE' })
    if (res.ok) {
      setMedia(prev => prev.filter(m => m.id !== mediaId))
    }
  }

  async function handleReorder(mediaId: string, direction: 'up' | 'down') {
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reorder', productId, mediaId, direction }),
    })
    if (res.ok) {
      setMedia(prev => {
        const idx = prev.findIndex(m => m.id === mediaId)
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= prev.length) return prev
        const newMedia = [...prev]
        ;[newMedia[idx], newMedia[swapIdx]] = [newMedia[swapIdx], newMedia[idx]]
        return newMedia
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Photos ({media.length})</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Photos'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {media.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12">
          <ImageIcon className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No photos yet</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Upload photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="relative aspect-square">
                <img
                  src={item.url}
                  alt={item.alt || ''}
                  className="h-full w-full object-cover"
                />
                {item.is_cover && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-medium text-yellow-900">
                      Cover
                    </span>
                  </div>
                )}
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleSetCover(item.id)}
                  className="rounded-full bg-white/90 p-1.5 hover:bg-white"
                  title="Set as cover"
                >
                  <Star className="h-3.5 w-3.5 text-yellow-500" />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(item.id, 'up')}
                  disabled={index === 0}
                  className="rounded-full bg-white/90 p-1.5 hover:bg-white disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(item.id, 'down')}
                  disabled={index === media.length - 1}
                  className="rounded-full bg-white/90 p-1.5 hover:bg-white disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full bg-white/90 p-1.5 hover:bg-white"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
