import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { getServerSupabase } from '@/supabase/server'

export default async function ContactPage() {
  const supabase = getServerSupabase()
  const { data: contact } = await supabase.from('contact_settings').select('*').eq('published', true).maybeSingle()
  const { data: settings } = await supabase.from('site_settings').select('brand_name, socials').maybeSingle()
  const socials = (settings?.socials as any[]) || []
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Section>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
              <h1 className="font-headline text-3xl text-primary mb-2">Contact</h1>
              <p className="text-on-surface-variant">We’re here to help. Reach out via email, phone, or WhatsApp.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-outline mb-1">Email</div>
                  <div className="font-semibold">{(contact?.emails || []).join(', ') || '—'}</div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-outline mb-1">Phone</div>
                  <div className="font-semibold">{(contact?.phones || []).join(', ') || '—'}</div>
                </div>
              </div>
              <div className="mt-4">
                <a href={`https://wa.me/${(contact?.whatsapp || '').replace(/[^0-9]/g,'')}`}><Button>WhatsApp Us</Button></a>
                {contact?.whatsapp_cta && <p className="text-sm text-outline mt-2">{contact.whatsapp_cta}</p>}
              </div>
            </div>
            {contact?.map_url && (
              <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
                <iframe src={contact.map_url} className="w-full h-[360px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
            <div className="bg-white rounded-2xl border border-outline-variant/10 p-6">
              <div className="text-[11px] uppercase tracking-widest text-outline mb-2">Social</div>
              <div className="flex flex-wrap gap-3">
                {socials.map((s:any, i:number)=> <a key={i} className="underline" href={s.url}>{s.name}</a>)}
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

