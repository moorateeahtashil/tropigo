"use client"

import { useState } from 'react'
import { getSupabaseClient } from '@/supabase/client'
import { Button, Input } from '@/components/admin/Forms'

export default function ImagePicker({ value, onChange }: { value?: string; onChange?: (url: string) => void }) {
  const supabase = getSupabaseClient()
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      const { data, error } = await supabase.storage.from('assets').upload(fileName, file, { upsert: false })
      if (error) throw error
      const { data: pub } = supabase.storage.from('assets').getPublicUrl(data.path)
      if (pub?.publicUrl) onChange?.(pub.publicUrl)
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="px-3 py-2 rounded-xl border border-outline-variant cursor-pointer bg-surface-container-lowest">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {uploading ? 'Uploading…' : 'Upload Image'}
        </label>
        <span className="text-xs text-outline">or paste URL</span>
      </div>
      <Input placeholder="https://..." value={value} onChange={(e) => onChange?.(e.target.value)} />
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="h-24 w-auto rounded-lg border border-outline-variant/30" />
      )}
    </div>
  )
}

