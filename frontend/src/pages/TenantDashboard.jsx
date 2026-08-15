import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, UserRound, MessageSquareText, CalendarDays, Wallet, MapPin, Star, ArrowUpRight, ShieldCheck, Heart, AlertCircle } from 'lucide-react'
import { fetchTenantProfile, fetchMyInterests, fetchListings } from '../services/api'
import toast from 'react-hot-toast'

function TenantDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [interests, setInterests] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [savedProperties, setSavedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const profileRes = await fetchTenantProfile()
      setProfile(profileRes.data)

      const interestRes = await fetchMyInterests()
      setInterests(interestRes.data)

      // Fetch all properties to generate matching recommendations
      const listingsRes = await fetchListings()
      const allListings = listingsRes.data.listings || []

      // If tenant profile exists, calculate matching recommendations client-side
      if (profileRes.data) {
        const pref = profileRes.data
        const matches = allListings.map((l) => {
          let score = 50 // Base compatibility score

          // Location match
          if (l.location.toLowerCase().includes(pref.preferredLocation.toLowerCase())) {
            score += 25
          }
          // Budget match
          if (l.rent >= pref.minBudget && l.rent <= pref.maxBudget) {
            score += 25
          } else if (l.rent < pref.minBudget) {
            score += 15
          }

          return { ...l, computedScore: Math.min(score, 100) }
        })
        
        // Sort matches descending by compatibility score
        const sorted = matches.sort((a, b) => b.computedScore - a.computedScore).slice(0, 3)
        setRecommendations(sorted)
      } else {
        setRecommendations(allListings.slice(0, 3))
      }

      // Load locally saved listings
      const localSaved = JSON.parse(localStorage.getItem('saved_listings') || '[]')
      setSavedProperties(localSaved)

    } catch (err) {
      console.error(err)
      // Usually profile not found triggers 404 which is handled by displaying create profile prompt
      if (err.response?.status !== 404) {
        toast.error('Unable to fetch tenant dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  // TODO: Sync saved listings with backend database once API exists
  const handleRemoveSaved = (id) => {
    const updated = savedProperties.filter(p => p._id !== id)
    setSavedProperties(updated)
    localStorage.setItem('saved_listings', JSON.stringify(updated))
    toast.success('Property removed from saved listings')
  }

  return (
    <div className="space-y-8 text-left">
      {/* Hero Banner */}
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
              Tenant hub
            </div>
            <h1 className="app-title mt-4">Tenant dashboard</h1>
            <p className="app-subtitle">Review roommate compatibility scores, check pending listing interest status, and manage profile preferences.</p>
          </div>
          <Link to="/tenant-profile" className="app-button-primary">
            {profile ? 'Edit Match Profile' : 'Setup Preferences'}
          </Link>
        </div>
      </motion.div>

      {/* Main Layout Split */}
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        
        {/* Left Side: Profile Summary & Local Saved Listings */}
        <div className="space-y-6">
          
          {/* Profile Card */}
          <section className="app-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Preferences</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Setup matching values to filter roommate recommendations.</p>
              </div>
              <div className="rounded-full bg-slate-100 dark:bg-white/5 p-2 text-cyan-500">
                <UserRound className="h-4 w-4" />
              </div>
            </div>

            {profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200/50 dark:border-white/5">
                  <MapPin className="h-4.5 w-4.5 text-cyan-500" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Preferred Location</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{profile.preferredLocation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200/50 dark:border-white/5">
                  <Wallet className="h-4.5 w-4.5 text-cyan-500" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Budget Range</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">₹{profile.minBudget} - ₹{profile.maxBudget}/month</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200/50 dark:border-white/5">
                  <CalendarDays className="h-4.5 w-4.5 text-cyan-500" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Move-in date</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{new Date(profile.moveInDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="app-empty text-xs leading-6 p-6">
                <p>No preference profile found. Setup your tenant profile to unlock roommate compatibility analytics automatically.</p>
                <Link to="/tenant-profile" className="app-button-secondary text-xs mt-4 w-full">Setup Profile</Link>
              </div>
            )}
          </section>

          {/* Local Saved Listings */}
          <section className="app-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-rose-500" /> Saved Stays
            </h3>
            
            {savedProperties.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">Save interesting rooms while browsing to see them listed here.</p>
            ) : (
              <div className="space-y-3">
                {savedProperties.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/40 dark:border-white/5 text-xs bg-slate-50/50 dark:bg-white/2">
                    <div className="truncate flex-1 pr-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.location}</p>
                      <p className="text-slate-400 mt-0.5">₹{p.rent}/mo • {p.roomType}</p>
                    </div>
                    <button onClick={() => handleRemoveSaved(p._id)} className="text-[10px] font-bold text-rose-500 hover:underline">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Side: Requests tracker & Recommendations */}
        <div className="space-y-6">
          
          {/* Requests Applications */}
          <section className="app-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Application Status</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review active interest requests sent to owners.</p>
              </div>
              <div className="rounded-full bg-slate-100 dark:bg-white/5 p-2 text-cyan-500">
                <MessageSquareText className="h-4 w-4" />
              </div>
            </div>

            {interests.length === 0 ? (
              <div className="app-empty">You haven't shown interest in properties yet. Browse listings to apply!</div>
            ) : (
              <div className="space-y-4">
                {interests.map((i) => (
                  <div key={i._id} className="p-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-white dark:border-white/5 dark:bg-white/2 transition space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{i.listing?.location || 'Listing removed'}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Rent: ₹{i.listing?.rent || 'N/A'}/mo</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        i.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        i.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {i.status}
                      </span>
                    </div>

                    {i.compatibility && (
                      <div className="flex items-center justify-between text-xs bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200/20 dark:border-white/5">
                        <span className="text-slate-400">Match score:</span>
                        <strong className="text-cyan-500 font-bold">{i.compatibility.score}%</strong>
                      </div>
                    )}

                    {i.status === 'Accepted' && (
                      <button 
                        onClick={() => navigate(`/chat?listingId=${i.listing?._id}&receiverId=${i.owner}`)}
                        className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 py-2.5 shadow-sm"
                      >
                        <MessageSquareText className="h-3.5 w-3.5" /> Open Chat Messenger
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Room recommendations */}
          {profile && recommendations.length > 0 && (
            <section className="app-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Places</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Curated stays matching your budget and location.</p>
                </div>
                <div className="rounded-full bg-slate-100 dark:bg-white/5 p-2 text-cyan-500">
                  <Star className="h-4 w-4" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {recommendations.map((r) => (
                  <div key={r._id} className="p-3.5 rounded-xl border border-slate-200/40 dark:border-white/5 bg-slate-50/50 hover:bg-white dark:bg-white/2 dark:hover:bg-slate-950/40 transition flex flex-col justify-between">
                    <div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img 
                          src={r.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'} 
                          alt="" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white mt-3 truncate text-sm">{r.location}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{r.roomType} • ₹{r.rent}</p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-600 dark:text-cyan-400 font-bold">{r.computedScore || 80}% match</span>
                      <Link to={`/listings/${r._id}`} className="text-[10px] text-slate-400 hover:text-cyan-500 font-bold flex items-center gap-0.5">
                        Details <ArrowUpRight className="h-3 w-3" />
                      </Link>
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

export default TenantDashboard