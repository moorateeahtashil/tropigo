import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button, Field, Input, Textarea } from '@/components/admin/Forms'

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} />
      <PageHeader title="Site Settings" subtitle="Brand, defaults, analytics" actions={<Button>Save</Button>} />
      <div className="grid gap-4">
        <Field label="Brand Name"><Input placeholder="Tropigo" defaultValue="Tropigo" /></Field>
        <Field label="Logo URL"><Input placeholder="/logo.svg" /></Field>
        <Field label="Default Locale"><Input placeholder="en" defaultValue="en" /></Field>
        <Field label="Currency"><Input placeholder="MUR" defaultValue="MUR" /></Field>
        <Field label="Contact Email"><Input placeholder="hello@example.com" /></Field>
        <Field label="GA4 ID"><Input placeholder="G-XXXXXX" /></Field>
        <Field label="Default Meta Description"><Textarea placeholder="SEO default..." /></Field>
      </div>
    </div>
  )
}

