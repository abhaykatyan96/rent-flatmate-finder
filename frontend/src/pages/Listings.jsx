import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, CalendarDays, Sparkles, Home, Wallet, Eye, Heart, RefreshCw, ChevronLeft, ChevronRight, SlidersHorizontal, Trash2 } from 'lucide-react'
import { fetchListings, sendInterest } from '../services/api'
import { getUser } from '../utils/auth'
import toast from 'react-hot-toast'

function Listings() {
  const navigate = useNavigate()
  const user = getUser()

  // State variables for search/filters
  const [location, setLocation] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [roomType, setRoomType] = useState('')
  const [furnishingStatus, setFurnishingStatus] = useState('')
  
  // Pagination & Loading States
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Toggle filter drawer on mobile
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    loadListings()
  }, [page, roomType, furnishingStatus])

  async function loadListings() {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        limit: 6,
      }
      if (location) params.location = location
      if (minBudget) params.minBudget = minBudget
      if (maxBudget) params.maxBudget = maxBudget
      if (roomType) params.roomType = roomType
      if (furnishingStatus) params.furnishingStatus = furnishingStatus

      const res = await fetchListings(params)
      setListings(res.data.listings)
      setTotalPages(res.data.totalPages || 1)
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error(err)
      setError('Unable to load listings. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    loadListings()
  }

  const handleResetFilters = () => {
    setLocation('')
    setMinBudget('')
    setMaxBudget('')
    setRoomType('')
    setFurnishingStatus('')
    setPage(1)
    // Direct call because state changes won't be flushed yet
    setTimeout(() => {
      loadListings()
    }, 50)
  }

  const handleInterest = async (listingId) => {
    if (!user) {
      toast.error('Please log in to express interest')
      navigate('/login')
      return
    }

    if (user.role !== 'tenant') {
      toast.error('Only tenants can express interest')
      return
    }

    const toastId = toast.loading('Sending interest request...')
    try {
      await sendInterest(listingId)
      toast.success('Interest registered successfully!', { id: toastId })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register interest', { id: toastId })
    }
  }

  return (
    <div className="space-y-8 text-left">
      <motion.header 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="app-shell p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="app-chip">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Verified Co-living Spaces
            </div>
            <h1 className="app-title mt-4">Browse co-living properties</h1>
            <p className="app-subtitle">Filter housing by pricing, size, and location. Uncover roommate compatibility automatically.</p>
          </div>
          <div className="rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300">
            {total} spaces found
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="flex items-center gap-3 rounded-[20px] border border-slate-200/80 bg-white/90 px-4 py-2.5 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
            <Search className="h-4.5 w-4.5 text-cyan-500" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by city, location or neighbourhood..."
              className="w-full bg-transparent outline-none placeholder:text-slate-400 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="app-button-primary flex-1 text-xs sm:text-sm">
              Apply Search
            </button>
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)} 
              className="app-button-secondary py-2.5 px-4 text-slate-500"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5"
            >
              <div className="grid gap-4 sm:grid-cols-4">
                
                {/* Min Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Min Budget (₹)</label>
                  <div className="flex items-center gap-2 rounded-[16px] border border-slate-200/80 bg-white/50 px-3.5 py-2.5 text-xs dark:border-white/10 dark:bg-slate-950/40">
                    <Wallet className="h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="e.g. 5000" 
                      value={minBudget} 
                      onChange={e => setMinBudget(e.target.value)} 
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Max Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Max Budget (₹)</label>
                  <div className="flex items-center gap-2 rounded-[16px] border border-slate-200/80 bg-white/50 px-3.5 py-2.5 text-xs dark:border-white/10 dark:bg-slate-950/40">
                    <Wallet className="h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="e.g. 25000" 
                      value={maxBudget} 
                      onChange={e => setMaxBudget(e.target.value)} 
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Room Type</label>
                  <select 
                    value={roomType} 
                    onChange={e => setRoomType(e.target.value)}
                    className="w-full rounded-[16px] border border-slate-200/80 bg-white/50 px-3.5 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                  >
                    <option value="">All Types</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>

                {/* Furnishing Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Furnishing Status</label>
                  <select 
                    value={furnishingStatus} 
                    onChange={e => setFurnishingStatus(e.target.value)}
                    className="w-full rounded-[16px] border border-slate-200/80 bg-white/50 px-3.5 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>

              </div>
              
              <div className="mt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleResetFilters} 
                  className="flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white/50 px-4.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Reset Filters
                </button>
                <button 
                  type="button" 
                  onClick={loadListings} 
                  className="app-button-primary text-xs py-2 px-5"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="app-card space-y-4 animate-pulse">
              <div className="aspect-[4/3] rounded-[18px] bg-slate-100 dark:bg-white/5 w-full" />
              <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-2/3" />
              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/2" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-700 dark:text-rose-200">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <div className="app-empty p-12 max-w-xl mx-auto">
          <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 animate-bounce" />
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-200">No properties matched</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-6">We couldn't find listings matching your specific filters. Try expanding your budget range or choosing another location.</p>
          <button onClick={handleResetFilters} className="app-button-primary mt-6 text-xs">Clear Filter Queries</button>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && listings.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((l) => (
            <motion.article
              key={l._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="app-card flex flex-col justify-between"
            >
              <div>
                {/* Photo Gallery with high contrast Rent Badge */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-slate-100 dark:bg-slate-950">
                  <img 
                    src={l.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'} 
                    alt={l.location} 
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80' }}
                  />
                  {/* High contrast Rent Tag */}
                  <div className="absolute top-3 right-3 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black tracking-wide text-white shadow-md border border-white/10 dark:bg-white dark:text-slate-950 dark:border-slate-800">
                    ₹{l.rent}/mo
                  </div>
                </div>

                {/* Specs */}
                <div className="mt-4 space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                    <Home className="h-3 w-3" />
                    {l.roomType}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{l.location}</h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hosted by <strong className="font-semibold text-slate-700 dark:text-slate-300">{l.owner?.name || 'Verified Host'}</strong></p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-50 pt-4 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    <span>{new Date(l.availableFrom).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right capitalize text-slate-500 dark:text-slate-400 font-semibold">
                    {l.furnishingStatus}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-2 border-t border-slate-50 pt-4 dark:border-white/5">
                <Link to={`/listings/${l._id}`} className="app-button-secondary flex-1 py-2.5 text-xs font-bold gap-1">
                  <Eye className="h-3.5 w-3.5" /> View Details
                </Link>
                <button 
                  onClick={() => handleInterest(l._id)}
                  disabled={l.isFilled}
                  className="app-button-primary py-2.5 px-4 text-xs font-bold gap-1"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  <span>Interested</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            onClick={() => setPage(p => Math.max(p - 1, 1))} 
            disabled={page === 1}
            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold">Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
            disabled={page === totalPages}
            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Listings