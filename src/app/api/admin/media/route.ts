import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const formData = await req.formData()
  const productId = formData.get('productId') as string
  const file = formData.get('file') as File

  if (!productId || !file) {
    return NextResponse.json({ error: 'Missing productId or file' }, { status: 400 })
  }

  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `products/${productId}/${Date.now()}_${fileName}`

  const { error: upErr } = await supabase.storage.from('assets').upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${path}`

  // Get next sort order
  const { data: existing } = await supabase
    .from('product_media')
    .select('sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: false })
    .limit(1)
  const nextSort = existing?.[0]?.sort_order ? existing[0].sort_order + 1 : 0

  const { data, error } = await supabase
    .from('product_media')
    .insert({
      product_id: productId,
      url: publicUrl,
      alt: null,
      media_type: 'image',
      is_cover: existing?.length === 0,  // First image becomes cover
      sort_order: nextSort,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { action, productId, mediaId, direction } = body

  if (action === 'setCover') {
    await supabase.from('product_media').update({ is_cover: false }).eq('product_id', productId)
    await supabase.from('product_media').update({ is_cover: true }).eq('id', mediaId)
    return NextResponse.json({ success: true })
  }

  if (action === 'reorder' && mediaId && direction) {
    // Get all media for this product ordered by sort_order
    const { data: mediaList } = await supabase
      .from('product_media')
      .select('id, sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })

    if (!mediaList) return NextResponse.json({ error: 'No media found' }, { status: 404 })

    const idx = mediaList.findIndex(m => m.id === mediaId)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (idx < 0 || swapIdx < 0 || swapIdx >= mediaList.length) {
      return NextResponse.json({ error: 'Invalid reorder' }, { status: 400 })
    }

    const a = mediaList[idx]
    const b = mediaList[swapIdx]
    await supabase.from('product_media').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('product_media').update({ sort_order: a.sort_order }).eq('id', b.id)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const mediaId = searchParams.get('mediaId')
  const productId = searchParams.get('productId')

  if (!mediaId) return NextResponse.json({ error: 'Missing mediaId' }, { status: 400 })

  // Get the media URL to delete from storage
  const { data: media } = await supabase.from('product_media').select('url').eq('id', mediaId).single()

  if (media?.url) {
    const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/`
    if (media.url.startsWith(prefix)) {
      const path = media.url.substring(prefix.length)
      await supabase.storage.from('assets').remove([path]).catch(() => {})
    }
  }

  await supabase.from('product_media').delete().eq('id', mediaId)
  return NextResponse.json({ success: true })
}
