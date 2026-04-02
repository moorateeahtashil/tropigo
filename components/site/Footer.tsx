export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="px-6 md:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-semibold tracking-widest text-[11px] uppercase mb-6 text-secondary">Company</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li><a className="hover:text-white" href="#">About</a></li>
            <li><a className="hover:text-white" href="#">Our Team</a></li>
            <li><a className="hover:text-white" href="#">Careers</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold tracking-widest text-[11px] uppercase mb-6 text-secondary">Explore</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li><a className="hover:text-white" href="#">Villas</a></li>
            <li><a className="hover:text-white" href="#">Experiences</a></li>
            <li><a className="hover:text-white" href="#">Regions</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold tracking-widest text-[11px] uppercase mb-6 text-secondary">Support</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li><a className="hover:text-white" href="#">Help Center</a></li>
            <li><a className="hover:text-white" href="#">Contact</a></li>
            <li><a className="hover:text-white" href="#">Booking Terms</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold tracking-widest text-[11px] uppercase mb-6 text-secondary">Legal</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li><a className="hover:text-white" href="#">Privacy</a></li>
            <li><a className="hover:text-white" href="#">Cookies</a></li>
            <li><a className="hover:text-white" href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="px-6 md:px-12 pb-10 text-center text-[10px] text-white/60 uppercase tracking-widest">
        © {new Date().getFullYear()} Tropigo. Curated Tropical Excellence.
      </div>
    </footer>
  )
}

