import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Users, Building2, MessageSquare, Trash2, RefreshCw, BarChart3 } from 'lucide-react'
import { adminFetchUsers, adminDeleteUser, adminFetchListings, adminDeleteListing, adminFetchInterests } from '../services/api'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'listings' | 'interests'

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    setLoading(true)
    try {
      const usersRes = await adminFetchUsers()
      const listingsRes = await adminFetchListings()
      const interestsRes = await adminFetchInterests()

      setUsers(usersRes.data)
      setListings(listingsRes.data)
      setInterests(interestsRes.data)
    } catch (err) {
      console.error(err)
      toast.error('Unable to fetch admin dashboard records')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete user "${name}"? This action is irreversible.`)
    if (!confirm) return

    const toastId = toast.loading('Deleting user account...')
    try {
      await adminDeleteUser(id)
      toast.success('User deleted successfully', { id: toastId })
      loadAdminData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete operation failed', { id: toastId })
    }
  }

  const handleDeleteListing = async (id, location) => {
    const confirm = window.confirm(`Are you sure you want to remove property listing at "${location}"?`)
    if (!confirm) return

    const toastId = toast.loading('Deleting property listing...')
    try {
      await adminDeleteListing(id)
      toast.success('Listing deleted successfully', { id: toastId })
      loadAdminData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete operation failed', { id: toastId })
    }
  }

  // Calculate metrics
  const totalUsers = users.length
  const totalListings = listings.length
  const totalInterests = interests.length

  // User Role Breakdown for Recharts
  const tenantsCount = users.filter((u) => u.role === 'tenant').length
  const ownersCount = users.filter((u) => u.role === 'owner').length
  const adminsCount = users.filter((u) => u.role === 'admin').length

  const roleChartData = [
    { name: 'Tenants', value: tenantsCount, color: '#38bdf8' },
    { name: 'Owners', value: ownersCount, color: '#a78bfa' },
    { name: 'Admins', value: adminsCount, color: '#ec4899' },
  ]

  // Listing Room Type Breakdown
  const singleCount = listings.filter((l) => l.roomType === 'single').length
  const doubleCount = listings.filter((l) => l.roomType === 'double').length
  const sharedCount = listings.filter((l) => l.roomType === 'shared').length

  const roomTypeChartData = [
    { name: 'Single Room', count: singleCount },
    { name: 'Double Room', count: doubleCount },
    { name: 'Shared Room', count: sharedCount },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-slate-500 dark:text-slate-400">Loading admin console analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="app-shell p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-2xl" />
        <div className="flex flex-wrap items-center justify-between gap-6 relative">
          <div>
            <div className="app-chip">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Administrative command panel
            </div>
            <h1 className="app-title mt-4">Admin dashboard</h1>
            <p className="app-subtitle">Track system users growth, listing distributions, request metrics, and moderate content.</p>
          </div>
          <button onClick={loadAdminData} className="app-button-secondary text-xs py-2 px-4 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Records
          </button>
        </div>
      </motion.div>

      {/* Analytics KPI cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalUsers}</p>
          </div>
          <div className="rounded-full bg-cyan-500/10 p-3.5 text-cyan-500">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Properties</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalListings}</p>
          </div>
          <div className="rounded-full bg-violet-500/10 p-3.5 text-violet-500">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Connection Requests</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalInterests}</p>
          </div>
          <div className="rounded-full bg-pink-500/10 p-3.5 text-pink-500">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytical charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Roles distribution */}
        <div className="app-card space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-500" /> Users Roles Breakdown
          </h3>
          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={roleChartData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {roleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Listings Room type distribution */}
        <div className="app-card space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-violet-500" /> Properties room distribution
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomTypeChartData} barSize={40}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Switchable Management Tables */}
      <section className="app-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4 dark:border-white/5">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('users')} 
              className={`px-4 py-2 text-xs font-semibold rounded-full transition ${activeTab === 'users' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              Registered Users
            </button>
            <button 
              onClick={() => setActiveTab('listings')} 
              className={`px-4 py-2 text-xs font-semibold rounded-full transition ${activeTab === 'listings' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              Active Listings
            </button>
            <button 
              onClick={() => setActiveTab('interests')} 
              className={`px-4 py-2 text-xs font-semibold rounded-full transition ${activeTab === 'interests' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              Requests Analytics
            </button>
          </div>
        </div>

        {/* Tab 1: Users */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/60 dark:border-white/10 dark:bg-slate-950/40">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-700 dark:divide-white/10 dark:text-slate-300">
              <thead className="bg-slate-50/80 text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 font-medium">{u.email}</td>
                    <td className="px-6 py-4 capitalize font-semibold text-cyan-600 dark:text-cyan-400">{u.role}</td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="text-rose-500 hover:text-rose-700 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Listings */}
        {activeTab === 'listings' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/60 dark:border-white/10 dark:bg-slate-950/40">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-700 dark:divide-white/10 dark:text-slate-300">
              <thead className="bg-slate-50/80 text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Room Type</th>
                  <th className="px-6 py-4">Rent</th>
                  <th className="px-6 py-4">Furnishing</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {listings.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{l.location}</td>
                    <td className="px-6 py-4 capitalize font-medium">{l.roomType}</td>
                    <td className="px-6 py-4 font-bold">₹{l.rent}/mo</td>
                    <td className="px-6 py-4 capitalize">{l.furnishingStatus}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${l.isFilled ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {l.isFilled ? 'Filled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteListing(l._id, l.location)}
                        className="text-rose-500 hover:text-rose-700 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Interests */}
        {activeTab === 'interests' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/60 dark:border-white/10 dark:bg-slate-950/40">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-700 dark:divide-white/10 dark:text-slate-300">
              <thead className="bg-slate-50/80 text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Tenant Name</th>
                  <th className="px-6 py-4">Host Name</th>
                  <th className="px-6 py-4">Listing Location</th>
                  <th className="px-6 py-4">Compatibility</th>
                  <th className="px-6 py-4">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {interests.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{i.tenant?.name || 'Deleted User'}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{i.owner?.name || 'Deleted User'}</td>
                    <td className="px-6 py-4 font-medium">{i.listing?.location || 'Deleted Property'}</td>
                    <td className="px-6 py-4 font-bold text-cyan-600 dark:text-cyan-400">
                      {i.compatibility ? `${i.compatibility.score || 80}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        i.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                        i.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  )
}

export default AdminDashboard
