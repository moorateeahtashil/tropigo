export default function Topbar({ title }: { title?: string }) {
  return (
    <header className="h-16 bg-surface-container-low flex items-center justify-between px-4 md:px-8 border-b border-outline-variant/20">
      <div>
        <h2 className="font-headline text-xl font-bold text-primary">{title ?? 'Admin'}</h2>
        <p className="text-[10px] text-outline font-label tracking-widest uppercase">Manage content & bookings</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">🔎</span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-secondary w-64 shadow-sm placeholder:text-outline/50"
            placeholder="Search..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary">Admin</p>
            <p className="text-[10px] text-secondary font-bold tracking-tighter uppercase">Super Admin</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-9 h-9 rounded-full object-cover border-2 border-surface-container-high shadow-sm"
            alt="admin avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3nk2ST1u1oNcFgsuKzIUUIu-yhVu136p5xcrHhWNCvSd7ld9ndAuw7IEnVUWeTGOEbrRqHN4jgz8psh_bCIrJKFVg1X2MBj-EQTj20Ogs31MqW8tpucRn9pG46A0ZbDAKgp2paDpjg4r6ZFvgKHs9mrTgeR9ccn-CWz9uQkYOV2Pgr3nmBW6D2NLSBWpej34zOzvdDD1jzxR36VkEv3PINHuDDRtCe6UValsqnxTHpm-EoQmg8sDDzs_ORcNLSv9CXHVLMYhJioI"
          />
        </div>
      </div>
    </header>
  )
}

