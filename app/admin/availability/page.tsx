import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'

export default function AdminAvailability() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Availability' }]} />
      <PageHeader title="Availability" subtitle="Manage tour inventory and pricing" actions={<Button>New Slot</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Tour</TH>
            <TH>Starts</TH>
            <TH>Ends</TH>
            <TH>Capacity</TH>
            <TH>Price</TH>
            <TH>Active</TH>
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
            <TD>—</TD>
            <TD right>—</TD>
          </TR>
        </TBody>
      </Table>
    </div>
  )
}

