import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getFaqs, getFaqCategories } from '@/features/content/queries'

export const revalidate = 600

export default async function FaqPage() {
  const [categories, faqs] = await Promise.all([
    getFaqCategories(),
    getFaqs(),
  ])

  const byCategory = new Map<string, Awaited<ReturnType<typeof getFaqs>>>()
  for (const c of categories) byCategory.set(c, [])
  for (const f of faqs) byCategory.get(f.category)?.push(f)

  return (
    <>
      <Header />
      <main className="container-page pt-28 pb-16">
        <h1 className="heading-display text-4xl">Frequently Asked Questions</h1>
        <div className="mt-8 space-y-10">
          {Array.from(byCategory.entries()).map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-semibold text-ink capitalize">{category}</h2>
              <div className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
                {items.map(f => (
                  <details key={f.id} className="group p-4">
                    <summary className="cursor-pointer list-none font-medium text-ink">
                      {f.question}
                    </summary>
                    <div className="mt-2 text-ink-secondary whitespace-pre-line">{f.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

