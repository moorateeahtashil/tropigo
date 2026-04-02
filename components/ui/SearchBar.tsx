export default function SearchBar() {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-outline-variant/20 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Experience</label>
          <div className="mt-2 relative">
            <select className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-secondary focus:border-secondary appearance-none">
              <option>Any</option>
              <option>Snorkeling</option>
              <option>Fishing</option>
              <option>Helicopter</option>
            </select>
          </div>
        </div>
        <div>
          <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Travel Date</label>
          <div className="mt-2 relative">
            <input className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-secondary focus:border-secondary" type="date" />
          </div>
        </div>
        <div>
          <label className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Guests</label>
          <div className="mt-2 relative">
            <select className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-secondary focus:border-secondary appearance-none">
              <option>2 Adults</option>
              <option>4 Adults</option>
              <option>Family</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button className="w-full bg-primary text-white py-3 rounded-full font-label text-xs tracking-widest uppercase hover:bg-on-primary-fixed transition-colors">Check Availability</button>
      </div>
    </div>
  )
}

