import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import CategoryCard from '@/components/ui/CategoryCard'
import { getServerSupabase } from '@/supabase/server'

export default async function ActivitiesIndex() {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('activity_categories')
    .select('id, name, slug, image_url, position')
    .eq('published', true)
    .order('position', { ascending: true })
  const rows = data || []
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section bg="surface" padding="lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-headline text-4xl text-primary">Activities</h1>
              <p className="text-on-surface-variant text-sm mt-2">Categories of curated experiences</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rows.map((c:any)=> (
              <CategoryCard key={c.id} name={c.name} image={c.image_url} href={`/activities/${c.slug}`} />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

