import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'

export default function AdminFooter() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Footer' }]} />
      <PageHeader title="Footer" subtitle="Manage footer groups and links" actions={<Button>New Group</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Key</TH>
            <TH>Title</TH>
            <TH>Items</TH>
            <TH>Position</TH>
            <TH>Published</TH>
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

