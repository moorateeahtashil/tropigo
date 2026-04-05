import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  )
}
