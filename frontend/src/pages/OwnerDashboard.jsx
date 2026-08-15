import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Building2, Plus, Sparkles, CheckCircle2, XCircle, Trash2, PencilLine, Home, UserRound, ArrowUpRight, BarChart3, MessageSquare, AlertCircle } from 'lucide-react'
import { fetchMyListings, fetchOwnerInterests, updateInterest, markListingFilled, deleteListing } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function OwnerDashboard() {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)

  // Activities log simulation
  const [activities, setActivities] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const listingsRes = await fetchMyListings()
      const interestsRes = await fetchOwnerInterests()

      setListings(listingsRes.data)
      setInterests(interestsRes.data)

      // Generate dynamic recent activities logs
      const logs = []
      if (listingsRes.data.length > 0) {
        logs.push({ text: `You published listing at ${listingsRes.data[0].location}`, time: 'Recently' })
      }
      interestsRes.data.slice(0, 2).forEach((intr) => {
        logs.push({ text: `${intr.tenant.name} expressed interest in ${intr.listing?.location || 'your space'}`, time: 'Recently' })
      })
      setActivities(logs)
    } catch (err) {
      console.error(err)
      toast.error('Unable to retrieve dashboard information')
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(id) {
    const toastId = toast.loading('Accepting tenant request...')
    try {
      await updateInterest(id, 'Accepted')
      toast.success('Request accepted! Chat is now unlocked for communication.', { id: toastId })
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed', { id: toastId })
    }
  }

  async function handleReject(id) {
    const toastId = toast.loading('Declining tenant request...')
    try {
      await updateInterest(id, 'Rejected')
      toast.success('Request rejected.', { id: toastId })
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed', { id: toastId })
    }
  }

  async function handleFilled(id) {
    const toastId = toast.loading('Marking property as filled...')
    try {
      await markListingFilled(id)
      toast.success('Listing marked as filled!', { id: toastId })
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed', { id: toastId })
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing permanently?')
    if (!confirmDelete) return

    const toastId = toast.loading('Removing property...')
    try {
      await deleteListing(id)
      toast.success('Listing deleted successfully', { id: toastId })
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed', { id: toastId })
    }
  }

  function handleEdit(id) {
    navigate(`/edit-listing/${id}`)
  }

  // Calculate analytical statistics
  const totalListings = listings.length
  const filledListings = listings.filter(l => l.isFilled).length
  const availableListings = totalListings - filledListings
  const totalRequests = interests.length
  const pendingRequests = interests.filter(i => i.status === 'Pending').length

  // Recharts occupancy data
  const chartData = [
    { name: 'Available', value: availableListings, color: '#38bdf8' },
    { name: 'Filled', value: filledListings, color: '#ec4899' },
  ]

  // Recharts request states data
  const requestStates = [
    { name: 'Pending', count: interests.filter(i => i.status === 'Pending').length },
    { name: 'Accepted', count: interests.filter(i => i.status === 'Accepted').length },
    { name: 'Rejected', count: interests.filter(i => i.status === 'Rejected').length },
  ]

  return (
    <div className="space-y-8 text-left">
      {/* Hero Header banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="app-shell p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-2xl" />
        <div className="flex flex-wrap items-center justify-between gap-6 relative">
          <div>
            <div className="app-chip">
              <Sparkles className="h-4 w-4 text-cyan-500 animate-spin" />
              Owner command panel
            </div>
            <h1 className="app-title mt-4">Owner dashboard</h1>
            <p className="app-subtitle">Track listing occupancies, review tenant match compatibility scores, and accept applications.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/create-listing" className="app-button-primary">
              <Plus className="h-4 w-4" />
              Create Listing
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalListings}</p>
          </div>
          <div className="rounded-full bg-cyan-500/10 p-3.5 text-cyan-500">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available spaces</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{availableListings}</p>
          </div>
          <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Filled stays</p>
            <p className="text-3xl font-extrabold text-pink-600 dark:text-pink-400 mt-2">{filledListings}</p>
          </div>
          <div className="rounded-full bg-pink-500/10 p-3.5 text-pink-500">
            <Home className="h-6 w-6" />
          </div>
        </div>

        <div className="app-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inquiries Received</p>
            <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mt-2">{totalRequests}</p>
          </div>
          <div className="rounded-full bg-violet-500/10 p-3.5 text-violet-500">
            <UserRound className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Analytics & Charts */}
      {listings.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Occupancy Chart */}
          <div className="app-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-500" /> Space Occupancy Distribution
            </h3>
            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={45}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Status Chart */}
          <div className="app-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-violet-500" /> Interest Requests Breakdown
            </h3>
            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestStates} barSize={45}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: My listings vs Tenant requests */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        
        {/* Listings Section */}
        <section className="app-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Listings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage listings updates, filled stats, and removals.</p>
            </div>
            <div className="rounded-full bg-slate-100 dark:bg-white/5 p-2 text-cyan-500">
              <Building2 className="h-4 w-4" />
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="app-empty">No listings registered yet. Register one to see details!</div>
          ) : (
            <div className="space-y-4">
              {listings.map((l) => (
                <div key={l._id} className="p-5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-white dark:border-white/5 dark:bg-white/2 dark:hover:bg-slate-950/40 transition">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                        <Home className="h-3 w-3" />
                        {l.roomType} • {l.furnishingStatus}
                      </span>
                      <h3 className="mt-2.5 text-lg font-bold text-slate-900 dark:text-white">{l.location}</h3>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Rent: ₹{l.rent}/month</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${l.isFilled ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                      {l.isFilled ? 'Filled' : 'Active'}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4 dark:border-white/5">
                    <button onClick={() => handleEdit(l._id)} className="app-button-secondary text-xs py-2 px-4 gap-1">
                      <PencilLine className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(l._id)} className="inline-flex items-center justify-center gap-1 text-xs font-bold rounded-full border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/15 px-4 py-2 text-rose-600 dark:text-rose-400 transition">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                    {!l.isFilled && (
                      <button onClick={() => handleFilled(l._id)} className="inline-flex items-center justify-center gap-1 text-xs font-bold rounded-full border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/15 px-4 py-2 text-emerald-600 dark:text-emerald-400 transition ml-auto">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Filled
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tenant Requests & Activity Log */}
        <div className="space-y-6">
          
          {/* Requests list */}
          <section className="app-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tenant Requests</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accept requests to enable messaging.</p>
              </div>
              <div className="rounded-full bg-slate-100 dark:bg-white/5 p-2 text-cyan-500">
                <UserRound className="h-4 w-4" />
              </div>
            </div>

            {interests.length === 0 ? (
              <div className="app-empty">No active inquires received yet. Listings matches will show up here.</div>
            ) : (
              <div className="space-y-4">
                {interests.map((i) => (
                  <div key={i._id} className="p-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-white dark:border-white/5 dark:bg-white/2 transition space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{i.tenant.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{i.tenant.email}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded max-w-max">
                          For: {i.listing?.location || 'Listing space'}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        i.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                        i.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {i.status}
                      </span>
                    </div>

                    {/* Compatibility Match Score */}
                    {i.compatibility && (
                      <div className="flex items-center justify-between text-xs bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200/20 dark:border-white/5">
                        <span className="text-slate-400">Gemini Compatibility score:</span>
                        <strong className="text-cyan-500 font-bold">{i.compatibility.score}%</strong>
                      </div>
                    )}

                    {/* Accept/Reject or Chat */}
                    {i.status === 'Pending' ? (
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => handleAccept(i._id)} className="inline-flex items-center justify-center gap-1 text-xs font-bold rounded-full border border-emerald-500/15 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-emerald-600 dark:text-emerald-400 transition flex-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button onClick={() => handleReject(i._id)} className="inline-flex items-center justify-center gap-1 text-xs font-bold rounded-full border border-rose-500/15 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 text-rose-600 dark:text-rose-400 transition flex-1">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    ) : i.status === 'Accepted' ? (
                      <button 
                        onClick={() => navigate(`/chat?listingId=${i.listing?._id}&receiverId=${i.tenant?._id}`)}
                        className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 py-2.5 shadow-sm"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Open Chat Messenger
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Activity Log */}
          {activities.length > 0 && (
            <section className="app-card space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent activity timeline</h3>
              <div className="space-y-3">
                {activities.map((a, index) => (
                  <div key={index} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <AlertCircle className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{a.text}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard