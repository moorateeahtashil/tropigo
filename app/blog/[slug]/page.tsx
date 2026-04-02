import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import { getServerSupabase } from '@/supabase/server'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = getServerSupabase()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).eq('published', true).maybeSingle()
  const { data: related } = await supabase
    .from('blog_post_related')
    .select('related_id, blog_posts!inner(id,title,slug)')
    .eq('post_id', post?.id || '00000000-0000-0000-0000-000000000000')
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl text-primary mb-3">{post?.title || 'Article'}</h1>
            {post?.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image_url} alt={post.title} className="w-full rounded-2xl border border-outline-variant/10 mb-6" />
            )}
            <div className="whitespace-pre-line text-on-surface-variant">{post?.content || ''}</div>
            {related && related.length > 0 && (
              <div className="mt-10">
                <div className="text-[11px] uppercase tracking-widest text-outline mb-2">Related</div>
                <ul className="list-disc ml-5">
                  {related.map((r:any,i:number)=>(
                    <li key={i}><a className="underline" href={`/blog/${r.blog_posts.slug}`}>{r.blog_posts.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
