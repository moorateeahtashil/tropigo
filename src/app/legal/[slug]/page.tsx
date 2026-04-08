import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getLegalPageBySlug } from '@/features/content/queries'

export const revalidate = 600

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const page = await getLegalPageBySlug(params.slug)
  if (!page) return notFound()

  return (
    <>
      <Header />
      <main className="container-page prose pt-28 pb-16">
        <h1>{page.title}</h1>
        <article className="whitespace-pre-line">{page.content}</article>
      </main>
      <Footer />
    </>
  )
}

