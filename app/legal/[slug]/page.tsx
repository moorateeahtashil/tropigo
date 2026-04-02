import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import { getServerSupabase } from '@/supabase/server'

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const supabase = getServerSupabase()
  const { data } = await supabase.from('legal_pages').select('*').eq('slug', params.slug).eq('published', true).maybeSingle()
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-outline-variant/10 p-6">
            <h1 className="font-headline text-3xl text-primary mb-2">{data?.title || 'Legal'}</h1>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (data?.content || '').replace(/\n/g,'<br/>') }} />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

