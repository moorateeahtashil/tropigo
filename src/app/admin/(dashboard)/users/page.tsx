import { listUsers } from './actions'
import UsersClient from './UsersClient'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await listUsers()
  return <UsersClient initialUsers={users} />
}
