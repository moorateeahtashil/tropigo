import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import Accordion from '@/components/ui/Accordion'
import { getServerSupabase } from '@/supabase/server'

export default async function FAQPage() {
  const supabase = getServerSupabase()
  const { data } = await supabase.from('faqs').select('question,answer,position').eq('published', true).order('position', { ascending: true })
  const items = (data || []).map((f:any)=>({ title: f.question, content: <p>{f.answer}</p> }))
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-3xl text-primary mb-4">Frequently Asked Questions</h1>
            <Accordion items={items} />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

