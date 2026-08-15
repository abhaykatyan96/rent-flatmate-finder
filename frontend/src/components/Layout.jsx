import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Building2, UserRound, MessageSquareText, ShieldCheck, LogOut, Sparkles, PanelTop, MoonStar, SunMedium, Bell, Menu, X, ChevronDown, Check, User } from 'lucide-react'
import { getUser, logout } from '../utils/auth'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Listings', path: '/listings', icon: Building2 },
]

function Layout() {
  const user = getUser()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)

  // Demo notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to Rent & Flatmate Finder!', read: false, time: 'Just now' },
    { id: 2, text: 'Setup your tenant profile to unlock matching score.', read: true, time: '2 hours ago' },
  ])

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast.success('Marked all as read')
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const renderNavLinks = (mobile = false) => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            } ${mobile ? 'w-full justify-start' : ''}`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}

      {user?.role === 'owner' && (
        <NavLink 
          to="/owner" 
          onClick={() => setMobileMenuOpen(false)} 
          className={({ isActive }) => 
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive 
                ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            } ${mobile ? 'w-full justify-start' : ''}`
          }
        >
          <PanelTop className="h-4 w-4" />
          Owner Dashboard
        </NavLink>
      )}

      {user?.role === 'tenant' && (
        <>
          <NavLink 
            to="/tenant" 
            onClick={() => setMobileMenuOpen(false)} 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
              } ${mobile ? 'w-full justify-start' : ''}`
            }
          >
            <UserRound className="h-4 w-4" />
            Tenant Dashboard
          </NavLink>
          <NavLink 
            to="/chat" 
            onClick={() => setMobileMenuOpen(false)} 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
              } ${mobile ? 'w-full justify-start' : ''}`
            }
          >
            <MessageSquareText className="h-4 w-4" />
            Chat
          </NavLink>
        </>
      )}

      {user?.role === 'admin' && (
        <NavLink 
          to="/admin" 
          onClick={() => setMobileMenuOpen(false)} 
          className={({ isActive }) => 
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive 
                ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            } ${mobile ? 'w-full justify-start' : ''}`
          }
        >
          <ShieldCheck className="h-4 w-4" />
          Admin Dashboard
        </NavLink>
      )}
    </>
  )

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_40%,_#f8fafc_100%)] text-slate-800 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.15),_transparent_35%),linear-gradient(135deg,_#030712_0%,_#07111f_50%,_#020617_100%)] dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Floating Glass Navbar */}
        <header className="sticky top-4 z-40 mb-8 rounded-[32px] border border-slate-200/60 bg-white/70 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_20px_80px_rgba(2,6,23,0.3)]">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 shadow-md shadow-cyan-500/20">
                <Sparkles className="h-5 w-5 text-slate-950" />
              </span>
              <span className="hidden sm:inline bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-violet-400 font-extrabold">Flatmate Finder</span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {renderNavLinks(false)}
            </nav>

            <div className="flex items-center gap-2">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                aria-label="Toggle theme" 
                className="rounded-full border border-slate-200/60 bg-white/50 p-2.5 text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {theme === 'dark' ? <SunMedium className="h-4 w-4 text-amber-400" /> : <MoonStar className="h-4 w-4 text-violet-500" />}
              </button>

              {/* Notifications Tray */}
              {user && (
                <div className="relative" ref={notificationsRef}>
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    aria-label="Notifications" 
                    className="relative rounded-full border border-slate-200/60 bg-white/50 p-2.5 text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900 z-50"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/5">
                          <h4 className="font-semibold text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-cyan-500 hover:underline">Mark all read</button>
                          )}
                        </div>
                        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                          {notifications.map(n => (
                            <div key={n.id} className={`p-2.5 rounded-xl text-xs transition ${n.read ? 'text-slate-500 dark:text-slate-400' : 'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-100 font-medium'}`}>
                              <p>{n.text}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Login/Register or Profile Dropdown */}
              {!user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <NavLink to="/login" className="rounded-full border border-slate-200/60 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] shadow-sm shadow-cyan-400/10">
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white/50 p-1.5 pr-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400/20 to-violet-500/20 text-cyan-600 dark:text-cyan-300">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="max-w-[70px] truncate">{user.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200/60 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900 z-50"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{user.role}</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="mt-1.5">
                          {user.role === 'owner' && <button onClick={() => { setProfileDropdownOpen(false); navigate('/owner'); }} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Owner Dashboard</button>}
                          {user.role === 'tenant' && <button onClick={() => { setProfileDropdownOpen(false); navigate('/tenant'); }} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Tenant Dashboard</button>}
                          {user.role === 'admin' && <button onClick={() => { setProfileDropdownOpen(false); navigate('/admin'); }} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Admin Dashboard</button>}
                          <button 
                            onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 mt-1 border-t border-slate-50 dark:border-white/5 pt-2"
                          >
                            <LogOut className="h-3.5 w-3.5" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="rounded-full border border-slate-200/60 bg-white/50 p-2.5 text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

            </div>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-[24px] border border-slate-200/60 bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 md:hidden"
            >
              <div className="flex flex-col gap-2 text-sm">
                {renderNavLinks(true)}
                
                {!user && (
                  <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
                    <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center rounded-full border border-slate-200/60 bg-white py-2 text-sm font-semibold dark:border-white/5 dark:bg-slate-800">
                      Login
                    </NavLink>
                    <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 py-2 text-sm font-semibold text-slate-950">
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="pb-16 min-h-[70vh]">
          <Outlet />
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/60 bg-white/40 py-12 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4 md:col-span-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 max-w-max shadow-md">
                <Sparkles className="h-4 w-4 text-slate-950" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Rent & Flatmate Finder</h3>
              <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 max-w-sm">
                Next-generation matching platform connecting compatible tenants and verified homeowners. Designed with trust, transparency, and compatibility signals in mind.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><NavLink to="/" className="hover:text-cyan-500 transition">Home</NavLink></li>
                <li><NavLink to="/listings" className="hover:text-cyan-500 transition">Listings</NavLink></li>
                <li><NavLink to="/login" className="hover:text-cyan-500 transition">Login</NavLink></li>
                <li><NavLink to="/register" className="hover:text-cyan-500 transition">Register</NavLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><a href="#" className="hover:text-cyan-500 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-500 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-500 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>&copy; {new Date().getFullYear()} Flatmate Finder Inc. All rights reserved.</p>
            <p className="font-medium bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Designed for high-trust co-living</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Layout
