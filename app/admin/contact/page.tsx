import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea } from '@/components/admin/Forms'

export default function AdminContact() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Contact' }]} />
      <PageHeader title="Contact Settings" subtitle="Primary contact profile" actions={<Button>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Emails">
          <Input placeholder="comma-separated" />
        </Field>
        <Field label="Phones">
          <Input placeholder="comma-separated" />
        </Field>
        <Field label="WhatsApp">
          <Input placeholder="+230 ..." />
        </Field>
        <Field label="Address">
          <Textarea placeholder="Structured address (JSON or lines)" />
        </Field>
        <Field label="Hours">
          <Textarea placeholder="Mon-Fri 9:00-17:00" />
        </Field>
      </div>
    </div>
  )
}

