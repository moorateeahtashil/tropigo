import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'

export default function AdminPromos() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Promos' }]} />
      <PageHeader title="Promo Banners" subtitle="Campaign messaging and placements" actions={<Button>New Promo</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Title</TH>
            <TH>Placement</TH>
            <TH>Active</TH>
            <TH>Window</TH>
            <TH>Priority</TH>
            <TH>Actions</TH>
          </tr>
        </THead>
        <TBody>
          <TR>
            <TD>—</TD>
            <TD>—</TD>
            <TD>—</TD>
            <TD>—</TD>
            <TD>—</TD>
            <TD right>—</TD>
          </TR>
        </TBody>
      </Table>
    </div>
  )
}

