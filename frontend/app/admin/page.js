'use client'

import { useAuth } from '../../components/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function AdminPortal() {
  const { user, token, loading, logout } = useAuth()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messageRef = useRef(null)
  const [pendingUsers, setPendingUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [broadcasts, setBroadcasts] = useState([])
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false)
  const [editBroadcastId, setEditBroadcastId] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    setMounted(true)
    if (!loading && !user) {
      router.push('/admin/login')
    } else if (user?.designation === 'Pastor') {
      router.push('/admin/pastor')
    } else if (user?.designation === 'Secretary') {
      router.push('/admin/secretary')
    }
    if (user?.designation === 'Developer') {
      fetchPendingUsers()
      fetchBroadcasts()
    }
  }, [user, loading, router])

  const fetchPendingUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch(`${API_URL}/admin_users.php?action=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setPendingUsers(await res.json())
      }
    } catch (e) {
      console.warn("Failed to fetch pending users", e)
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchBroadcasts = async () => {
    setLoadingBroadcasts(true)
    try {
      const res = await fetch(`${API_URL}/broadcast.php`)
      if (res.ok) {
        setBroadcasts(await res.json())
      }
    } catch (e) {
      console.warn("Failed to fetch broadcasts", e)
    } finally {
      setLoadingBroadcasts(false)
    }
  }

  const handleApproval = async (userId, action) => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return
    try {
      const res = await fetch(`${API_URL}/admin_users.php?action=${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      })
      if (res.ok) {
        alert(`User ${action}d successfully.`)
        fetchPendingUsers()
      } else {
        const data = await res.json()
        alert(data.error || `Failed to ${action} user.`)
      }
    } catch (e) {
      alert("Network error.")
    }
  }

  const handleDeleteBroadcast = async (id) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) return
    try {
      const res = await fetch(`${API_URL}/broadcast.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        alert('Broadcast deleted.')
        fetchBroadcasts()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to delete')
      }
    } catch (e) {
      alert("Network error")
    }
  }

  if (loading || !user || user.designation !== 'Developer') {
    return <div className="section container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage('')
    
    try {
      let endpoint = '';
      let formData = new FormData();
      
      if (user.designation === 'Pastor') {
        endpoint = '/blogs.php';
        formData.append('title', title);
        formData.append('content', content);
        if (mediaFile) formData.append('thumbnail', mediaFile);
        else formData.append('thumbnail_url', thumbnailUrl);
      } else if (user.designation === 'Secretary') {
        endpoint = '/announcements.php';
        formData.append('title', title);
        formData.append('content', content);
        if (mediaFile) formData.append('media', mediaFile);
      } else if (user.designation === 'Developer') {
        endpoint = '/broadcast.php';
      }

      let res;
      if (user.designation === 'Developer') {
        if (editBroadcastId) {
          res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: editBroadcastId, title, message: content })
          })
        } else {
          res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, message: content })
          })
        }
      } else {
        res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
      }
      
      if (res.ok) {
        setMessage(editBroadcastId ? 'Updated successfully!' : 'Published successfully!')
        setTitle('')
        setContent('')
        setThumbnailUrl('')
        setMediaFile(null)
        setEditBroadcastId(null)
        if (user.designation === 'Developer') fetchBroadcasts()
      } else {
        const error = await res.json()
        setMessage(error.error || 'Failed to publish')
      }
      setTimeout(() => {
        if (messageRef.current) {
          window.scrollTo({
            top: messageRef.current.offsetTop - 100,
            behavior: 'smooth'
          })
        }
      }, 100)
    } catch (err) {
      setMessage('An unexpected error occurred.')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      {showLogoutConfirm && mounted && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', color: '#111', fontWeight: '800' }}>Ready to Leave?</h3>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.5 }}>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', color: '#444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '1rem' }} onMouseOver={(e) => { e.target.style.background = '#ebebeb'; e.target.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.target.style.background = '#f5f5f5'; e.target.style.transform = 'translateY(0)' }}>Stay</button>
              <button onClick={logout} style={{ flex: 1, padding: '0.8rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '1rem', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)' }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)' }}>Log Out</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="section container" style={{ marginTop: '80px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#111', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-1px' }}>{user.designation} Dashboard</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.8rem' }}>Welcome back, <strong style={{color: 'var(--color-primary)'}}>{user.full_name}</strong></p>
        </div>
        <button onClick={() => setShowLogoutConfirm(true)} style={{ padding: '0.7rem 1.8rem', border: 'none', color: '#fff', backgroundColor: 'var(--color-primary)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)'; }}>
          Sign Out
        </button>
      </div>

      {user.designation === 'Developer' && (
        <div style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div onClick={() => router.push('/admin/pastor')} style={{ background: 'var(--color-primary)', padding: '2rem', borderRadius: '20px', color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(139, 0, 0, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 0, 0, 0.2)'; }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: '700' }}>Pastor Interface</h3>
            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Manage blogs and inspirational messages.</p>
          </div>
          <div onClick={() => router.push('/admin/secretary')} style={{ background: 'var(--color-primary)', padding: '2rem', borderRadius: '20px', color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(139, 0, 0, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 0, 0, 0.2)'; }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: '700' }}>Secretary Interface</h3>
            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Manage notices, special programs, and arrangements.</p>
          </div>
          <div onClick={() => router.push('/admin/events')} style={{ background: 'var(--color-primary)', padding: '2rem', borderRadius: '20px', color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(139, 0, 0, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 0, 0, 0.2)'; }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Events &amp; Wings</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: '#3b82f6', color: '#fff', fontWeight: '700' }}>NEW</span>
            </h3>
            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Upload wing events with Google Drive photo galleries &amp; word count limits.</p>
          </div>
          {/* <div style={{ flex: 1, minWidth: '250px', background: 'var(--color-primary)', padding: '2rem', borderRadius: '20px', color: '#fff', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(139, 0, 0, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 0, 0, 0.2)'; }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Aazadi Quiz</h3>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Welcome host! Here you can control the quiz being the game admin. Cheers!</p>
            <a
              href="https://churchquiz-player.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.5)', transition: 'all 0.2s ease' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            >
              Game Link
            </a>
          </div> */}
        </div>
      )}



      <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%)', padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,0,0,0.03) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {user.designation === 'Pastor' ? 'Write a new Blog/Message' : 
             user.designation === 'Secretary' ? 'Post an Announcement' : 
             editBroadcastId ? 'Edit Emergency Info' : 'Broadcast Emergency Info'}
          </h2>
          {editBroadcastId && (
            <button onClick={() => {
              setEditBroadcastId(null)
              setTitle('')
              setContent('')
            }} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Cancel Edit
            </button>
          )}
        </div>
        
        {message && (
          <div ref={messageRef} style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: message.includes('success') ? '#e6ffe6' : '#ffe6e6', color: message.includes('success') ? '#006600' : '#cc0000', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '500' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '1.1rem 1.2rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontFamily: 'inherit', fontSize: '1rem', background: '#fafafa', transition: 'all 0.2s ease' }} 
              placeholder="Title"
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(139,0,0,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#fafafa'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          
          {user.designation !== 'Developer' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>Upload Media (Image/Video)</label>
              <input 
                type="file" 
                onChange={(e) => setMediaFile(e.target.files[0])}
                style={{ width: '100%', padding: '1.1rem 1.2rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontFamily: 'inherit', fontSize: '1rem', background: '#fafafa', cursor: 'pointer' }} 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>Content / Message</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '1.1rem 1.2rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontFamily: 'inherit', fontSize: '1.05rem', background: '#fafafa', minHeight: '300px', resize: 'vertical', lineHeight: '1.7', transition: 'all 0.2s ease' }} 
              placeholder="Write your message here..."
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(139,0,0,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#fafafa'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button type="submit" disabled={submitLoading} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', marginTop: '1.5rem', opacity: submitLoading ? 0.7 : 1, cursor: submitLoading ? 'not-allowed' : 'pointer', border: 'none', borderRadius: '12px', fontWeight: '700', transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)', boxShadow: '0 8px 20px rgba(139, 0, 0, 0.2)' }} onMouseOver={(e) => { if(!submitLoading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 25px rgba(139, 0, 0, 0.3)'; } }} onMouseOut={(e) => { if(!submitLoading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 20px rgba(139, 0, 0, 0.2)'; } }}>
            {submitLoading ? (editBroadcastId ? 'Updating...' : 'Publishing...') : (editBroadcastId ? 'Update Message' : 'Publish Message')}
          </button>
        </form>

        {user.designation === 'Developer' && (
          <div style={{ marginTop: '4rem', borderTop: '2px dashed #eaeaea', paddingTop: '3rem', position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111' }}>Manage Existing Broadcasts</h3>
            {loadingBroadcasts ? <p>Loading broadcasts...</p> : broadcasts.length === 0 ? <p style={{ color: '#666' }}>No broadcasts found.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {broadcasts.map(b => (
                  <div key={b.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#111', fontSize: '1.1rem', fontWeight: '700' }}>{b.title}</h4>
                      <p style={{ margin: 0, color: '#555', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>{b.message}</p>
                      <small style={{ color: '#888', marginTop: '0.6rem', display: 'block', fontWeight: '500' }}>{new Date(b.created_at).toLocaleString()}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => {
                        setTitle(b.title)
                        setContent(b.message)
                        setEditBroadcastId(b.id)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }} style={{ padding: '0.6rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#334155', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9' }} onMouseOut={(e) => { e.target.style.background = '#f8fafc' }}>Edit</button>
                      
                      <button onClick={() => handleDeleteBroadcast(b.id)} style={{ padding: '0.6rem 1.2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#dc2626', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.background = '#fee2e2' }} onMouseOut={(e) => { e.target.style.background = '#fef2f2' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      </div>
    </>
  )
}
