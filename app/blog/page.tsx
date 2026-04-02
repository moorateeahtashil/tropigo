import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import { getServerSupabase } from '@/supabase/server'
import { Card, CardBody, CardMedia } from '@/components/ui/Card'

export default async function BlogIndex({ searchParams }: { searchParams: { category?: string } }) {
  const supabase = getServerSupabase()
  const { data: cats } = await supabase.from('blog_categories').select('id,name,slug').eq('published', true).order('name')
  let query = supabase.from('blog_posts').select('id,title,slug,excerpt,cover_image_url,blog_categories!left(name,slug)').eq('published', true).order('published_at', { ascending: false })
  if (searchParams.category) {
    const c = (cats || []).find((x:any)=>x.slug === searchParams.category)
    if (c) query = query.eq('category_id', c.id)
  }
  const { data: posts } = await query
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-headline text-4xl text-primary">Travel Guide</h1>
              <p className="text-on-surface-variant text-sm mt-2">Stories and insights from Mauritius</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(posts || []).map((p:any)=>(
              <a key={p.id} href={`/blog/${p.slug}`}>
                <Card>
                  {p.cover_image_url && <CardMedia src={p.cover_image_url} alt={p.title} aspect="aspect-[16/10]" />}
                  <CardBody>
                    <h3 className="font-headline text-xl text-primary">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{p.excerpt}</p>}
                  </CardBody>
                </Card>
              </a>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

