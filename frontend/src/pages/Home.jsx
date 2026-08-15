import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Building2, Search, Zap, MessageSquare, ChevronDown, Check, Star, Users } from 'lucide-react'
import { fetchListings } from '../services/api'

const features = [
  {
    title: 'Smart Matching System',
    description: 'We analyze your budget, preferred locations, and habits to calculate an accurate compatibility score with any host or roommate.',
    icon: Sparkles,
  },
  {
    title: 'Verified Home Owners',
    description: 'Every listing undergoes screening to verify owner authenticity and property location, giving you absolute peace of mind.',
    icon: ShieldCheck,
  },
  {
    title: 'Real-time Chat Messenger',
    description: 'Connect instantly with listings owners or prospective tenants in a private, real-time chat room once compatibility is approved.',
    icon: MessageSquare,
  },
]

const steps = [
  {
    num: '01',
    title: 'Create Your Profile',
    desc: 'Input your preferred location, ideal monthly budget, and move-in timeline. Owners can list their properties with specifications.',
  },
  {
    num: '02',
    title: 'Check Compatibility',
    desc: 'Our system analyzes preferences and automatically scores roommate compatibility using AI, saving you hours of manual research.',
  },
  {
    num: '03',
    title: 'Chat & Move In',
    desc: 'Send an interest application. Once approved, the chat unlocks instantly for you to coordinate visits, details, and sign.',
  },
]

const FAQs = [
  {
    q: 'How does the compatibility score work?',
    a: 'The compatibility score is calculated using advanced matching algorithms that compare tenant preferences (budget, location, move-in window) with property owner preferences, listing specifications, and flatmate profiles.',
  },
  {
    q: 'Is Flatmate Finder free to use?',
    a: 'Yes, basic searching, profile creation, listing, and messaging are entirely free. We aim to help find trusted co-living matches without high brokerage fees.',
  },
  {
    q: 'How do I contact property owners?',
    a: 'Once you find a listing you like, click "I am Interested" to send a request to the owner. When they accept your interest request, a secure real-time chat room opens automatically.',
  },
]

const testimonials = [
  {
    name: 'Aravind Swamy',
    role: 'Software Engineer at Google',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    comment: 'Finding a roommate in Bangalore used to take weeks of filtering through spam groups. Flatmate Finder calculated my compatibility and found me a flatmate in 3 days. Extremely polished interface!',
    rating: 5,
  },
  {
    name: 'Neha Roy',
    role: 'UI Designer',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    comment: 'As a property owner, I wanted verified working professionals who match my housing rules. Being able to review compatibility scores and tenant profiles before accepting chat requests is a lifesaver.',
    rating: 5,
  },
]

function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    loadListings()
  }, [])

  async function loadListings() {
    try {
      const res = await fetchListings()
      // Only show the 3 latest available (unfilled) listings
      const activeListings = res.data.listings.filter(l => !l.isFilled).slice(0, 3)
      setListings(activeListings)
    } catch (err) {
      console.error('Failed to load listings', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[40px] border border-slate-200/60 bg-white/40 p-8 sm:p-16 lg:p-20 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
      >
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 text-left">
            <div className="app-chip">
              <Sparkles className="h-4 w-4 text-cyan-500 animate-pulse" />
              Intelligence-driven flatmate search
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Co-living simplified.<br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 bg-clip-text text-transparent">Match by compatibility.</span>
              </h1>

              <p className="app-subtitle max-w-xl text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                Discover trusted housing, calculate flatmate compatibility, and communicate instantly with owners. Flatmate Finder brings high-trust designs to rent management.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/listings" className="app-button-primary px-6 py-3.5">
                Browse Available Stays
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link to="/register" className="app-button-secondary px-6 py-3.5">
                Join Community
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/60 dark:border-white/5">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">10k+</p>
                <p className="text-xs text-slate-400 mt-1">Active Users</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">98%</p>
                <p className="text-xs text-slate-400 mt-1">Match Success</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">0%</p>
                <p className="text-xs text-slate-400 mt-1">Brokerage Fees</p>
              </div>
            </div>
          </div>

          {/* Hero Featured Listings Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-slate-950/40 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured properties</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Latest availability</h2>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
                <Building2 className="h-4 w-4" />
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="app-empty p-8 text-xs">No active listings available right now. Check back shortly!</div>
            ) : (
              <div className="space-y-4">
                {listings.map((l) => (
                  <motion.div
                    key={l._id}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-100 hover:border-cyan-400/30 bg-slate-50/50 hover:bg-white dark:border-white/5 dark:hover:border-cyan-400/30 dark:bg-white/5 transition"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-950 flex-shrink-0">
                      <img 
                        src={l.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80'} 
                        alt={l.location} 
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{l.location}</h4>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{l.roomType} • {l.furnishingStatus}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-1">Owner: {l.owner?.name || 'Verified Owner'}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        ₹{l.rent}/mo
                      </span>
                      <Link to={`/listings/${l._id}`} className="block text-[10px] text-cyan-500 hover:underline mt-2 font-bold uppercase tracking-wider">
                        Details &rarr;
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="app-chip">Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Built for high-trust housing decisions</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            No more endless WhatsApp group chats or unverified brokers. Flatmate Finder handles everything through an integrated, clean flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="app-card p-8 flex flex-col text-left justify-between"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-600 dark:text-cyan-300">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="space-y-12 bg-slate-50/50 dark:bg-white/2 p-8 sm:p-16 rounded-[40px] border border-slate-200/60 dark:border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="app-chip">Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">How it works</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Getting set up takes less than five minutes. Follow these simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.num} className="text-left space-y-4 relative">
              <span className="text-6xl font-extrabold bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent opacity-30">{item.num}</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="app-chip">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Trusted by community members</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Hear what our verified homeowners and tenants have to say about co-living matches.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, idx) => (
            <div key={idx} className="app-card p-8 flex flex-col justify-between text-left">
              <p className="text-sm leading-8 text-slate-600 dark:text-slate-300 italic">
                "{t.comment}"
              </p>
              <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-white/5">
                <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <div className="flex gap-0.5 ml-auto text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-12 max-w-3xl mx-auto">
        <div className="text-center space-y-4">
          <span className="app-chip">FAQ</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-left">
          {FAQs.map((faq, i) => (
            <div 
              key={i} 
              className="rounded-2xl border border-slate-200/60 bg-white/60 dark:border-white/5 dark:bg-slate-900/60 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4.5 text-sm font-semibold text-slate-900 hover:text-cyan-500 dark:text-white dark:hover:text-cyan-400 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 pt-1 text-xs sm:text-sm leading-7 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home