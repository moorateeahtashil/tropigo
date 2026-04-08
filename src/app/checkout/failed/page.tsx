import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CheckoutFailed({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = searchParams.ref
  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-sand-200 bg-white p-8 text-center shadow-card">
          <h1 className="heading-display text-3xl text-red-700">Payment failed</h1>
          <p className="mt-2 text-ink-secondary">We could not complete your payment.</p>
          {ref && <p className="mt-4 text-ink">Reference: <span className="font-semibold">{ref}</span></p>}
          <Link href="/checkout" className="mt-6 inline-block rounded-xl bg-brand-700 px-4 py-2 text-white">Try again</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

