import { createTestimonial } from '../actions'

export default function NewTestimonial() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">New Testimonial</h1>
      <form action={createAction} className="space-y-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Author Name</span><input name="author_name" required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Author Location</span><input name="author_location" className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        </div>
        <label className="block text-sm"><span className="mb-1 block">Quote</span><textarea name="quote" rows={4} required className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block">Rating</span><input name="rating" type="number" min={1} max={5} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
          <label className="block text-sm"><span className="mb-1 block">Position</span><input name="position" type="number" defaultValue={0} className="w-full rounded-lg border-sand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" /></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked className="h-4 w-4 rounded border-sand-300" /> Published</label>
        <button className="rounded-xl bg-brand-700 px-3 py-2 text-white">Create</button>
      </form>
    </div>
  )
}

async function createAction(formData: FormData) {
  'use server'
  await createTestimonial({
    author_name: String(formData.get('author_name')||''),
    author_location: String(formData.get('author_location')||'') || null,
    quote: String(formData.get('quote')||''),
    rating: String(formData.get('rating')||'') ? Number(formData.get('rating')) : null,
    position: Number(formData.get('position')||0),
    published: formData.get('published') === 'on',
  })
}

