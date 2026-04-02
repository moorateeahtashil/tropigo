import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[520px] lg:h-[660px] flex items-center overflow-hidden">
          {/* Example remote image allowed in next.config */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEU3d2CtcGm_Dv19YYsr8PBrjDGU1NcLL_s7wFT1-cjvrMzxqJAfOjvNf4FpTf6qp4nt5FUU9Km26bp8nXUCy21bSD1ZTl33tfLbI8_ChQoqShHt4F__60j4NGDON56G-MCDWS00fuxQP1bXR1vMlvF3fuStg0W0ClrppYNYiJa6lBuIZVlF_uDzH0qL8R_uW9TMpp9KTgDf3IRT7X9UtP-YMm8CgmSSJ7ki6zP7PjNENioek_JcZWr4kcMoYx94MWchXxi4G2jFI"
            alt="Mauritius Sunset"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 px-6 md:px-12 max-w-4xl">
            <span className="tracking-[0.4em] uppercase text-[10px] text-secondary font-bold mb-4 block">Curated Travel</span>
            <h1 className="font-headline text-5xl lg:text-7xl text-white mb-6 leading-[1.1]">
              Unseen Mauritius, Direct Access
            </h1>
            <p className="text-white/85 text-base md:text-lg max-w-xl mb-8">
              Explore exclusive villas and experiences, handpicked by local experts.
            </p>
            <div className="flex gap-4">
              <button className="bg-secondary text-on-secondary px-6 md:px-8 py-3 rounded-full text-xs tracking-widest uppercase">
                Quick Explorer
              </button>
              <button className="border border-white/30 backdrop-blur-sm text-white px-6 md:px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-white/10 transition-colors">
                View Map
              </button>
            </div>
          </div>
        </section>

        {/* Benefits band */}
        <section className="bg-white py-6 md:py-8 border-b border-outline-variant/10">
          <div className="px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-primary">
            <div className="flex items-center gap-3 text-sm font-semibold tracking-widest uppercase">
              <span>✅</span>
              Top 1% Global Villas
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold tracking-widest uppercase">
              <span>⚡</span>
              Instant Confirmation
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold tracking-widest uppercase">
              <span>🕑</span>
              24/7 Priority Support
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold tracking-widest uppercase">
              <span>💳</span>
              Best Rate Guaranteed
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
