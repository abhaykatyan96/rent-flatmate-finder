import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SendHorizonal, MessageSquareText, Sparkles, User, ShieldCheck, MapPin, Smile, MoreVertical, RefreshCw } from 'lucide-react'
import socket from '../services/socket'
import { fetchMyInterests, fetchOwnerInterests, fetchListings, fetchChatMessages } from '../services/api'
import { getUser } from '../utils/auth'
import toast from 'react-hot-toast'

function Chat() {
  const user = getUser()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialListingId = searchParams.get('listingId')
  const initialReceiverId = searchParams.get('receiverId')

  // Chat Rooms / Sidebar States
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)

  // Typing & Online Status States
  // TODO: Implement backend socket events for real-time typing/online status sync
  const [typing, setTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.listingId)
      
      // Socket Join
      socket.emit('join', selectedConv.listingId)

      // Listen for message
      socket.on('receiveMessage', (msg) => {
        // Only append if the message belongs to this listing room
        if (msg.listing === selectedConv.listingId) {
          setMessages((prev) => [...prev, msg])
          scrollToBottom()

          // Trigger simulated typing indicator when receiving a message
          if (msg.sender._id !== user._id) {
            setTyping(true)
            setTimeout(() => setTyping(false), 1200)
          }
        }
      })
    }

    return () => {
      socket.off('receiveMessage')
    }
  }, [selectedConv])

  useEffect(() => {
    scrollToBottom()
  }, [messages, typing])

  async function loadConversations() {
    setLoading(true)
    try {
      let accepted = []
      
      if (user.role === 'tenant') {
        const interestsRes = await fetchMyInterests()
        accepted = interestsRes.data.filter((i) => i.status === 'Accepted')

        // Resolve listing owners details since interests listing is not fully populated
        const listingsRes = await fetchListings()
        accepted = accepted.map((item) => {
          const matchedListing = listingsRes.data.listings.find((l) => l._id === item.listing?._id)
          return {
            ...item,
            partner: {
              _id: matchedListing?.owner?._id || item.owner,
              name: matchedListing?.owner?.name || 'Owner',
              email: matchedListing?.owner?.email || ''
            }
          }
        })
      } else {
        // Owner role
        const interestsRes = await fetchOwnerInterests()
        accepted = interestsRes.data.filter((i) => i.status === 'Accepted')
        accepted = accepted.map((item) => ({
          ...item,
          partner: {
            _id: item.tenant?._id,
            name: item.tenant?.name || 'Tenant',
            email: item.tenant?.email || ''
          }
        }))
      }

      const convList = accepted.map((item) => ({
        id: item._id,
        listingId: item.listing?._id,
        location: item.listing?.location || 'Unknown Location',
        partner: item.partner,
      }))

      setConversations(convList)

      // Auto-select conversation from query params if available
      if (initialListingId && initialReceiverId) {
        const queryConv = convList.find(c => c.listingId === initialListingId && c.partner._id === initialReceiverId)
        if (queryConv) {
          setSelectedConv(queryConv)
        } else {
          // Fallback if not matching yet (create a temporary conv block)
          // We look it up in the retrieved listings
          const matched = convList[0] || null
          if (matched) setSelectedConv(matched)
        }
      } else if (convList.length > 0) {
        setSelectedConv(convList[0])
      }
    } catch (err) {
      console.error(err)
      toast.error('Unable to fetch chat channels')
    } finally {
      setLoading(false)
    }
  }

  async function loadMessages(listingId) {
    setMessagesLoading(true)
    try {
      const res = await fetchChatMessages(listingId)
      setMessages(res.data)
      setTimeout(scrollToBottom, 50)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load chat history')
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSend = (e) => {
    if (e) e.preventDefault()
    if (!newMessage.trim() || !selectedConv) return

    socket.emit('sendMessage', {
      sender: user._id,
      receiver: selectedConv.partner._id,
      listing: selectedConv.listingId,
      message: newMessage.trim(),
    })

    setNewMessage('')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-slate-500 dark:text-slate-400">Opening secure chat logs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-left">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="app-shell p-6"
      >
        <div className="app-chip">
          <Sparkles className="h-4 w-4 text-cyan-500 animate-spin" />
          Co-living messaging tunnel
        </div>
        <h1 className="app-title mt-4">Secure messenger</h1>
        <p className="app-subtitle">Direct line of communication between verified roommates and homeowners.</p>
      </motion.div>

      {conversations.length === 0 ? (
        <div className="app-empty max-w-xl mx-auto p-12">
          <MessageSquareText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4">No active conversations</h3>
          <p className="text-xs text-slate-400 mt-2 leading-6">Chat channels unlock automatically once an owner accepts a tenant's interest inquiry request. Browse listings to apply!</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] h-[650px]">
          
          {/* Left Sidebar Conversations List */}
          <div className="app-card p-4 overflow-y-auto flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Conversations</h3>
            
            <div className="space-y-2 mt-2">
              {conversations.map((c) => {
                const isActive = selectedConv?.id === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedConv(c)
                      setSearchParams({ listingId: c.listingId, receiverId: c.partner._id })
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3.5 ${
                      isActive 
                        ? 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-white dark:border-white/5 dark:bg-white/2 dark:hover:bg-slate-950/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 text-cyan-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm truncate text-slate-900 dark:text-white">{c.partner.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 truncate">{c.location}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Main Chat Frame */}
          <div className="app-card p-0 overflow-hidden flex flex-col justify-between relative">
            {selectedConv ? (
              <>
                {/* Chat Partner Header */}
                <div className="px-6 py-4.5 border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedConv.partner.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-semibold">Active Now</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] hidden sm:inline">{selectedConv.location}</span>
                    <button className="text-slate-400 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Message Log View */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/20">
                  {messagesLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-cyan-500" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 py-12">
                      <MessageSquareText className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                      No messages yet. Send a message to coordinate details!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender._id === user._id
                      return (
                        <div 
                          key={m._id} 
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-[20px] px-4.5 py-3 text-xs leading-6 shadow-sm border ${
                            isMe 
                              ? 'bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-violet-500/10 border-cyan-500/10 text-slate-900 dark:text-slate-100 font-medium' 
                              : 'bg-white border-slate-200/50 text-slate-700 dark:bg-slate-900 dark:border-white/5 dark:text-slate-300'
                          }`}>
                            <p className="font-bold text-[10px] uppercase text-cyan-500 mb-1">{isMe ? 'You' : m.sender.name}</p>
                            <p className="whitespace-pre-wrap">{m.message}</p>
                          </div>
                        </div>
                      )
                    })
                  )}

                  {/* Simulated Typing State */}
                  {typing && (
                    <div className="flex justify-start">
                      <div className="rounded-[20px] px-4.5 py-3 text-xs bg-white border border-slate-200/50 text-slate-400 dark:bg-slate-900 dark:border-white/5 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-75" />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input area */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900 flex items-center gap-3">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Write a message to ${selectedConv.partner.name}...`}
                    className="flex-1 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-cyan-400/50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                  />
                  <button 
                    type="submit" 
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 p-2.5 text-slate-950 hover:scale-[1.02] shadow-sm shadow-cyan-400/10 flex-shrink-0"
                  >
                    <SendHorizonal className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Select a conversation channel in the sidebar to start typing.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default Chat