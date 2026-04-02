import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'

export default async function Failed({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = searchParams.ref || '—'
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-xl mx-auto text-center py-16">
            <h1 className="font-headline text-3xl text-primary mb-2">Payment Failed</h1>
            <p className="text-on-surface-variant">Reference <span className="font-semibold">{ref}</span>.</p>
            <p className="text-on-surface-variant mt-2">Please try again or contact support.</p>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

