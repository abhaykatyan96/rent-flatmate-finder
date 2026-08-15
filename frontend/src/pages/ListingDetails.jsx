import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, MapPin, Wallet, CalendarDays, ShieldCheck, Heart, User, Mail, Info, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchListings, fetchCompatibility, sendInterest, fetchTenantProfile } from '../services/api'
import { getUser } from '../utils/auth'

function ListingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  
  const [listing, setListing] = useState(null)
  const [related, setRelated] = useState([])
  const [compatibility, setCompatibility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [compatLoading, setCompatLoading] = useState(false)
  const [error, setError] = useState('')
  const [interestSent, setInterestSent] = useState(false)

  useEffect(() => {
    loadListingData()
  }, [id])

  async function loadListingData() {
    setLoading(true)
    setError('')
    setCompatibility(null)
    setInterestSent(false)
    try {
      // Since there is no GET /api/listings/:id route, we fetch all and find the match
      const res = await fetchListings()
      const found = res.data.listings.find((item) => item._id === id)
      
      if (!found) {
        setError('Listing not found')
        setLoading(false)
        return
      }

      setListing(found)

      // Filter out current listing for related items
      const relatedItems = res.data.listings
        .filter((item) => item._id !== id && (item.roomType === found.roomType || item.location.toLowerCase().includes(found.location.toLowerCase())))
        .slice(0, 3)
      setRelated(relatedItems)

      // If user is a tenant, check if they have a tenant profile. If so, calculate compatibility
      if (user && user.role === 'tenant') {
        setCompatLoading(true)
        try {
          const profileRes = await fetchTenantProfile()
          if (profileRes.data) {
            const compatRes = await fetchCompatibility(id)
            setCompatibility(compatRes.data)
          }
        } catch (cErr) {
          console.warn('Could not load compatibility. Usually means tenant profile is missing or gemini key is not configured.', cErr)
        } finally {
          setCompatLoading(false)
        }
      }

    } catch (err) {
      console.error(err)
      setError('Unable to fetch listing details')
    } finally {
      setLoading(false)
    }
  }

  const handleInterest = async () => {
    if (!user) {
      toast.error('Please login to show interest')
      navigate('/login')
      return
    }

    if (user.role !== 'tenant') {
      toast.error('Only tenants can express interest')
      return
    }

    const toastId = toast.loading('Sending interest request...')
    try {
      await sendInterest(id)
      setInterestSent(true)
      toast.success('Interest registered! The owner will review your compatibility.', { id: toastId })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to express interest', { id: toastId })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-slate-500 dark:text-slate-400">Fetching listing details...</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="app-empty p-10">
          <Info className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{error || 'Something went wrong'}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The listing might have been removed or is no longer available.</p>
          <Link to="/listings" className="app-button-primary mt-6">
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/listings" className="app-button-secondary py-2">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Link>
        <span className="app-chip">
          <Sparkles className="h-4 w-4" /> Exclusive Listing
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {/* Images Gallery */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-slate-100 dark:bg-slate-950">
              {listing.photos && listing.photos.length > 0 && listing.photos[0] ? (
                <img 
                  src={listing.photos[0]} 
                  alt={listing.location} 
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' }}
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" 
                  alt="Default listing" 
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4 rounded-full bg-slate-900/70 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                ₹{listing.rent}/mo
              </div>
            </div>
            {listing.photos && listing.photos.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {listing.photos.slice(1, 5).map((photo, i) => (
                  <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950">
                    <img src={photo} alt="" className="h-full w-full object-cover cursor-pointer hover:opacity-80" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Overview */}
          <div className="app-card space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{listing.location}</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Available from: {new Date(listing.availableFrom).toLocaleDateString()}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[20px] border border-slate-200/80 bg-slate-50/55 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm text-slate-500 dark:text-slate-400">Room type</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white capitalize">{listing.roomType}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200/80 bg-slate-50/55 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm text-slate-500 dark:text-slate-400">Furnishing</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white capitalize">{listing.furnishingStatus}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200/80 bg-slate-50/55 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <p className={`mt-1 font-semibold ${listing.isFilled ? 'text-red-500' : 'text-emerald-500'}`}>
                  {listing.isFilled ? 'Filled / Occupied' : 'Active / Available'}
                </p>
              </div>
            </div>

            {/* Description placeholder */}
            <div className="border-t border-slate-200/60 pt-6 dark:border-white/10">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">About the Space</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Located in a quiet, vibrant neighbourhood. This {listing.roomType} space is {listing.furnishingStatus} and features modern amenities, great lighting, and close proximity to public transport. Perfect for students and working professionals looking for a high-quality co-living environment.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Action Box */}
          <div className="app-card space-y-5">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly Rent</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">₹{listing.rent} <span className="text-sm font-normal text-slate-500">/ month</span></p>
            </div>

            <button 
              onClick={handleInterest}
              disabled={listing.isFilled || interestSent}
              className={`w-full py-3.5 ${listing.isFilled || interestSent ? 'app-button-secondary cursor-not-allowed opacity-80' : 'app-button-primary'}`}
            >
              <Heart className="h-4 w-4 fill-current" />
              {interestSent ? 'Interest Registered' : listing.isFilled ? 'Listing Filled' : 'I am Interested'}
            </button>

            {listing.isFilled && (
              <p className="text-center text-xs text-rose-500 font-medium">This property has been marked filled by the owner.</p>
            )}
          </div>

          {/* Host Info Box */}
          <div className="app-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-500" /> Host Information
            </h3>
            {listing.owner ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                    <User className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{listing.owner.name}</p>
                    <p className="text-xs text-slate-400">Property Owner</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-3 dark:border-white/5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{listing.owner.email}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Host profile not available.</p>
            )}
          </div>

          {/* Compatibility score section */}
          {user?.role === 'tenant' && (
            <div className="app-card space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-500" /> Flatmate Compatibility
              </h3>
              
              {compatLoading ? (
                <div className="flex items-center justify-center py-6 gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-500" />
                  <p className="text-xs text-slate-400">Analyzing matching preferences...</p>
                </div>
              ) : compatibility ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Match score</span>
                    <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${
                      compatibility.score >= 80 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      compatibility.score >= 50 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {compatibility.score}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        compatibility.score >= 80 ? 'bg-emerald-500' :
                        compatibility.score >= 50 ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}
                      style={{ width: `${compatibility.score}%` }}
                    />
                  </div>
                  <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    {compatibility.explanation}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                  <p>Complete your <strong>Tenant Profile</strong> in the dashboard to generate compatibility scores for this listing automatically.</p>
                  <Link to="/tenant-profile" className="mt-2.5 inline-block text-cyan-500 font-semibold hover:underline">Setup preference profile &rarr;</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related listings */}
      {related.length > 0 && (
        <div className="border-t border-slate-200/60 pt-8 dark:border-white/10">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Related Spaces</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <motion.article 
                key={item._id}
                whileHover={{ y: -4 }}
                className="app-card flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={item.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'} 
                      alt="" 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white">
                      ₹{item.rent}
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white truncate">{item.location}</h3>
                  <p className="text-xs text-slate-400 mt-1 capitalize">{item.roomType} • {item.furnishingStatus}</p>
                </div>
                <Link to={`/listings/${item._id}`} className="app-button-secondary text-xs mt-4 w-full py-2.5">
                  View Details
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingDetails
