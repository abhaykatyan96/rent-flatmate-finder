import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, House } from 'lucide-react'

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-3xl flex-col items-center rounded-[32px] border border-slate-200/80 bg-white/80 p-10 text-center shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_24px_90px_rgba(2,6,23,0.3)] sm:p-12"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-700 dark:text-cyan-200">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Page not found</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">404</h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400">The page you are looking for cannot be found. Head back to the homepage or explore listings to continue your journey.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="app-button-primary">
          <House className="h-4 w-4" />
          Return home
        </Link>
        <Link to="/listings" className="app-button-secondary">
          Explore listings
        </Link>
      </div>
    </motion.div>
  )
}

export default NotFound
