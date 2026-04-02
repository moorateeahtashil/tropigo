import Breadcrumbs from '@/components/admin/Breadcrumbs'
import PageHeader from '@/components/admin/PageHeader'
import FilterBar from '@/components/admin/FilterBar'
import { Button } from '@/components/admin/Forms'
import { Table, THead, TH, TBody, TR, TD } from '@/components/admin/Table'

export default function AdminHomepage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Homepage' }]} />
      <PageHeader title="Homepage Sections" subtitle="Manage the homepage layout and content blocks" actions={<Button>New Section</Button>} />
      <FilterBar>
        <div className="text-sm text-outline">Filters coming soon</div>
      </FilterBar>
      <Table>
        <THead>
          <tr>
            <TH>Title</TH>
            <TH>Type</TH>
            <TH>Position</TH>
            <TH>Status</TH>
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

