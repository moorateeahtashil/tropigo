import PageHeader from '@/components/admin/PageHeader'
import Section from '@/components/admin/Section'

const stats = [
  { label: 'Bookings',     value: '—', sub: 'Total bookings' },
  { label: 'Tours',        value: '—', sub: 'Active tours'   },
  { label: 'Destinations', value: '—', sub: 'Destinations'   },
  { label: 'Enquiries',    value: '—', sub: 'Open enquiries' },
]

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your Tropigo platform" />
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {stats.map((s) => (
            <div key={s.label} className="admin-stat-card">
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
              <p className="admin-stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

