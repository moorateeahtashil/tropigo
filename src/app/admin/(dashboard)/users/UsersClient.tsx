'use client'

import { useState } from 'react'
import { Search, Shield, Users, UserPlus, X } from 'lucide-react'
import { toggleUserAdmin, createAdminUser } from './actions'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export default function UsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'admin' | 'customer'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const [addName, setAddName] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)

  const filtered = users.filter(u => {
    if (filter === 'admin' && !u.is_admin) return false
    if (filter === 'customer' && u.is_admin) return false
    if (search && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleToggle(userId: string, currentAdmin: boolean) {
    const newAdmin = !currentAdmin
    await toggleUserAdmin(userId, newAdmin)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: newAdmin } : u))
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    setAddLoading(true)
    setAddError(null)
    try {
      await createAdminUser(addEmail, addPassword, addName)
      setAddSuccess(true)
      // Refresh user list
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (Array.isArray(data)) setUsers(data)
      setTimeout(() => {
        setShowAddModal(false)
        setAddEmail('')
        setAddName('')
        setAddPassword('')
        setAddSuccess(false)
      }, 1500)
    } catch (err: any) {
      setAddError(err.message || 'Failed to create admin user')
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage admin and customer users.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4" />
          Add Admin
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {(['all', 'admin', 'customer'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${user.is_admin ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                      {user.is_admin ? <Shield className="h-4 w-4 text-indigo-600" /> : <Users className="h-4 w-4 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      {user.full_name && <p className="text-xs text-gray-500">{user.full_name}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.is_admin ? (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">Admin</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">Customer</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(user.id, user.is_admin)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      user.is_admin
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add New Admin</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {addSuccess ? (
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <Shield className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="font-medium text-green-800">Admin user created!</p>
                <p className="mt-1 text-sm text-green-600">The user can now access the admin panel.</p>
              </div>
            ) : (
              <form onSubmit={handleAddAdmin} className="space-y-4">
                {addError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {addError}
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name (optional)</label>
                  <input
                    type="text"
                    value={addName}
                    onChange={e => setAddName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={addEmail}
                    onChange={e => setAddEmail(e.target.value)}
                    required
                    placeholder="admin@tropigo.mu"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={addPassword}
                    onChange={e => setAddPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Choose a strong password. The user can change it later.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addLoading ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
