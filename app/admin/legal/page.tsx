import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import { Button } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'

export default function AdminLegal() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Legal' }]} />
      <PageHeader title="Legal Pages" subtitle="Privacy, terms, and policies" actions={<Button>New Page</Button>} />
      <Table>
        <THead>
          <tr>
            <TH>Title</TH>
            <TH>Slug</TH>
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
            <TD right>—</TD>
          </TR>
        </TBody>
      </Table>
    </div>
  )
}

