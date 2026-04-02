import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import DestinationCard from '@/components/ui/DestinationCard'
import { getServerSupabase } from '@/supabase/server'

export default async function DestinationsIndex() {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('destinations')
    .select('id, name, slug, summary, hero_image_url, featured, position')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('position', { ascending: true })
  const rows = data || []
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section bg="surface" padding="lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-headline text-4xl text-primary">Destinations</h1>
              <p className="text-on-surface-variant text-sm mt-2">Explore popular regions across Mauritius</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((d:any)=> (
              <DestinationCard key={d.id} name={d.name} summary={d.summary} image={d.hero_image_url} href={`/destinations/${d.slug}`} />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

