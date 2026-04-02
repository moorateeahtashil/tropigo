import Section from '@/components/ui/Section'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'

export default async function MockPay({ searchParams }: { searchParams: { bookingId?: string; ref?: string; token?: string } }) {
  const { bookingId = '', ref = '—', token = '' } = searchParams
  const successUrl = `/api/payments/mock/confirm?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(token)}&status=success`
  const failUrl = `/api/payments/mock/confirm?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(token)}&status=failure`
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-xl mx-auto text-center py-16 space-y-3">
            <h1 className="font-headline text-3xl text-primary">Mock Payment</h1>
            <p className="text-on-surface-variant">Booking reference <span className="font-semibold">{ref}</span></p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <a href={successUrl} className="px-6 py-3 rounded-xl bg-secondary text-on-secondary font-bold">Simulate Success</a>
              <a href={failUrl} className="px-6 py-3 rounded-xl border border-outline-variant">Simulate Failure</a>
            </div>
            <p className="text-[11px] text-outline mt-4">This is a mock provider for development only. Replace with real provider integration later.</p>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

