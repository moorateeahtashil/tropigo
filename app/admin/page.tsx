import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import Section from '@/components/admin/Section'
import { Card, CardBody, CardHeader } from '@/components/admin/Card'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin' }]} />
      <PageHeader title="Dashboard" subtitle="Overview and quick actions" />
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {['Bookings','Tours','Destinations','Promos'].map((k) => (
            <Card key={k}>
              <CardHeader>
                <div className="text-xs text-outline font-bold uppercase tracking-widest">{k}</div>
              </CardHeader>
              <CardBody>
                <div className="text-3xl font-headline text-primary">—</div>
                <div className="text-xs text-outline">Coming soon</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}

