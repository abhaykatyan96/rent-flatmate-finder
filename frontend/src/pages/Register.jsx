import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, Sparkles, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { register } from '../services/api'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('tenant')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await register({
        name,
        email,
        password,
        role,
      })
      toast.success('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to register at this time')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="app-shell flex-1 p-8 sm:p-10">
        <div className="app-chip">
          <Sparkles className="h-4 w-4" />
          Join the next generation of renting
        </div>
        <h1 className="app-title mt-6">Create your account</h1>
        <p className="app-subtitle text-lg">Open a profile as a tenant or owner and start exploring tailored housing opportunities.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="app-card flex-1 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="mb-2 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              Full name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="app-input"
              placeholder="Your full name"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="app-input"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="mb-2 block">I am joining as</span>
            <select value={role} onChange={(event) => setRole(event.target.value)} className="app-input">
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="app-input"
              placeholder="Choose a strong password"
            />
          </label>

          <button type="submit" disabled={loading} className="app-button-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default Register
