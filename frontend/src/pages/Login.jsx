import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const { data } = await login({ email, password })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'owner') {
        navigate('/owner')
      } else if (data.user.role === 'tenant') {
        navigate('/tenant')
      } else {
        navigate('/admin')
      }
      toast.success('Signed in successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="app-shell flex-1 p-8 sm:p-10">
        <div className="app-chip">
          <Sparkles className="h-4 w-4" />
          Secure access to your next chapter
        </div>
        <h1 className="app-title mt-6">Welcome back</h1>
        <p className="app-subtitle text-lg">Sign in to review matches, manage listings, and keep your conversations moving.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="app-card flex-1 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                placeholder="Enter your password"
              />
            </label>
          </div>

          <button type="submit" disabled={loading} className="app-button-primary w-full">
            {loading ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
