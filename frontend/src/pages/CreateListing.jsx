import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Sparkles, CalendarDays, DollarSign, ImagePlus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { createListing, updateListing, fetchListings } from '../services/api'

function CreateListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [form, setForm] = useState({
    location: '',
    rent: '',
    availableFrom: '',
    roomType: 'single',
    furnishingStatus: 'furnished',
    photos: ''
  })

  useEffect(() => {
    if (isEditMode) {
      loadListingForEdit()
    }
  }, [id])

  async function loadListingForEdit() {
    setFetching(true)
    try {
      const res = await fetchListings()
      const found = res.data.listings.find((item) => item._id === id)
      if (found) {
        setForm({
          location: found.location,
          rent: found.rent,
          availableFrom: found.availableFrom ? found.availableFrom.substring(0, 10) : '',
          roomType: found.roomType || 'single',
          furnishingStatus: found.furnishingStatus || 'furnished',
          photos: found.photos ? found.photos.join(', ') : ''
        })
      } else {
        toast.error('Listing not found for editing')
        navigate('/owner')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load listing for editing')
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
    
    if (!form.location.trim()) {
      toast.error('Location is required')
      return
    }
    if (Number(form.rent) <= 0) {
      toast.error('Rent must be a positive number')
      return
    }
    if (!form.availableFrom) {
      toast.error('Availability date is required')
      return
    }

    setLoading(true)

    const payload = {
      ...form,
      rent: Number(form.rent),
      photos: form.photos
        .split(',')
        .map(photo => photo.trim())
        .filter(photo => photo.length > 0)
    }

    try {
      if (isEditMode) {
        await updateListing(id, payload)
        toast.success('Listing updated successfully')
      } else {
        await createListing(payload)
        toast.success('Listing created successfully')
      }
      navigate('/owner')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Unable to save listing')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-slate-500 dark:text-slate-400">Loading property details...</p>
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
        {isEditMode ? 'Property Update Desk' : 'Property Registration Portal'}
      </div>
      <h1 className="app-title">{isEditMode ? 'Edit listing' : 'Create listing'}</h1>
      <p className="app-subtitle">
        {isEditMode 
          ? 'Modify your available co-living details to keep them matching potential tenants.' 
          : 'List your property to showcase compatibility metrics to matches.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        
        {/* Location input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Home className="h-4 w-4 text-cyan-500" /> Location / Address
          </label>
          <input 
            name="location" 
            placeholder="e.g. Indiranagar, Bangalore" 
            value={form.location} 
            onChange={handleChange} 
            required
            className="app-input" 
          />
        </div>

        {/* Rent input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-cyan-500" /> Monthly Rent (₹)
          </label>
          <input 
            name="rent" 
            type="number" 
            placeholder="e.g. 12000" 
            value={form.rent} 
            onChange={handleChange} 
            required
            className="app-input" 
          />
        </div>

        {/* Available from input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-cyan-500" /> Available From Date
          </label>
          <input 
            type="date" 
            name="availableFrom" 
            value={form.availableFrom} 
            onChange={handleChange} 
            required
            className="app-input" 
          />
        </div>

        {/* Room Type & Furnishing status dropdowns */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Room type</label>
            <select 
              name="roomType" 
              value={form.roomType} 
              onChange={handleChange} 
              className="app-input"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Furnishing status</label>
            <select 
              name="furnishingStatus" 
              value={form.furnishingStatus} 
              onChange={handleChange} 
              className="app-input"
            >
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>
        </div>

        {/* Photos input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ImagePlus className="h-4 w-4 text-cyan-500" /> Photo URLs
          </label>
          <input 
            name="photos" 
            placeholder="e.g. img1.jpg, img2.jpg (comma separated)" 
            value={form.photos} 
            onChange={handleChange} 
            className="app-input" 
          />
          <p className="text-[10px] text-slate-400">Add comma-separated web links to photos of the rooms.</p>
        </div>

        {/* Submit button */}
        <button 
          type="submit" 
          disabled={loading} 
          className="app-button-primary w-full py-3.5 mt-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" /> Saving Listing...
            </span>
          ) : (
            isEditMode ? 'Update Listing Details' : 'Publish Listing'
          )}
        </button>

      </form>
    </motion.div>
  )
}

export default CreateListing