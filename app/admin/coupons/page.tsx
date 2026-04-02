import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'

export default function AdminCoupons() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Coupons' }]} />
      <PageHeader title="Coupons" subtitle="Discount codes and rules" actions={<Button>New Coupon</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Code</TH>
            <TH>Kind</TH>
            <TH>Value</TH>
            <TH>Active</TH>
            <TH>Window</TH>
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

