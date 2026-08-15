import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Wallet, CalendarDays, Sparkles, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { createTenantProfile, updateTenantProfile, fetchTenantProfile } from '../services/api'
import { useNavigate } from 'react-router-dom'

function CreateTenantProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  
  const [form, setForm] = useState({
    preferredLocation: '',
    minBudget: '',
    maxBudget: '',
    moveInDate: ''
  })

  useEffect(() => {
    loadExistingProfile()
  }, [])

  async function loadExistingProfile() {
    try {
      const res = await fetchTenantProfile()
      if (res.data) {
        setForm({
          preferredLocation: res.data.preferredLocation || '',
          minBudget: res.data.minBudget || '',
          maxBudget: res.data.maxBudget || '',
          moveInDate: res.data.moveInDate ? res.data.moveInDate.substring(0, 10) : ''
        })
        setHasProfile(true)
      }
    } catch (err) {
      console.warn('Profile not found or fetch error (likely 404 for new users)', err)
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.preferredLocation.trim()) {
      toast.error('Preferred location is required')
      return
    }
    if (Number(form.minBudget) <= 0 || Number(form.maxBudget) <= 0) {
      toast.error('Budgets must be positive numbers')
      return
    }
    if (Number(form.minBudget) > Number(form.maxBudget)) {
      toast.error('Minimum budget cannot exceed maximum budget')
      return
    }
    if (!form.moveInDate) {
      toast.error('Ideal move-in date is required')
      return
    }

    setLoading(true)
    const payload = {
      ...form,
      minBudget: Number(form.minBudget),
      maxBudget: Number(form.maxBudget)
    }

    try {
      if (hasProfile) {
        await updateTenantProfile(payload)
        toast.success('Preferences updated successfully')
      } else {
        await createTenantProfile(payload)
        toast.success('Preferences saved successfully')
      }
      navigate('/tenant')
    } catch (err) {
      console.error(err)
      // Check if fallback update is needed
      if (err.response?.data?.message === "Profile already exists") {
        try {
          await updateTenantProfile(payload)
          toast.success('Preferences updated successfully')
          navigate('/tenant')
          return
        } catch (upErr) {
          toast.error(upErr.response?.data?.message || 'Failed to update preferences')
        }
      }
      toast.error(err.response?.data?.message || 'Unable to save preferences profile')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-slate-500 dark:text-slate-400">Loading profile data...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="app-shell mx-auto max-w-2xl p-8 sm:p-12 text-left"
    >
      <div className="app-chip mb-6">
        <Sparkles className="h-4 w-4 text-cyan-500" />
        Tenant Preferences Desk
      </div>
      <h1 className="app-title">{hasProfile ? 'Edit tenant profile' : 'Create tenant profile'}</h1>
      <p className="app-subtitle">Tell us your preferred location, monthly budget window, and ideal timeline to optimize roommate compatibility.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        
        {/* Preferred location input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-500" /> Preferred Location
          </label>
          <input 
            name="preferredLocation" 
            placeholder="e.g. Indiranagar, Bangalore" 
            value={form.preferredLocation} 
            onChange={handleChange} 
            required
            className="app-input" 
          />
        </div>

        {/* Budget Inputs */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-cyan-500" /> Minimum Budget (₹)
            </label>
            <input 
              name="minBudget" 
              type="number" 
              placeholder="e.g. 8000" 
              value={form.minBudget} 
              onChange={handleChange} 
              required
              className="app-input" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-cyan-500" /> Maximum Budget (₹)
            </label>
            <input 
              name="maxBudget" 
              type="number" 
              placeholder="e.g. 20000" 
              value={form.maxBudget} 
              onChange={handleChange} 
              required
              className="app-input" 
            />
          </div>
        </div>

        {/* Move-in date input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-cyan-500" /> Ideal Move-in Date
          </label>
          <input 
            type="date" 
            name="moveInDate" 
            value={form.moveInDate} 
            onChange={handleChange} 
            required
            className="app-input" 
          />
        </div>

        {/* Submit button */}
        <button 
          type="submit" 
          disabled={loading} 
          className="app-button-primary w-full py-3.5 mt-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" /> Saving Preferences...
            </span>
          ) : (
            hasProfile ? 'Update Preference Profile' : 'Save Preference Profile'
          )}
        </button>

      </form>
    </motion.div>
  )
}

export default CreateTenantProfile