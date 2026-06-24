'use client'

import { useAuth } from '../../components/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPortal() {
  const { user, token, loading, logout } = useAuth()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pendingUsers, setPendingUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    } else if (user?.designation === 'Pastor') {
      router.push('/admin/pastor')
    } else if (user?.designation === 'Secretary') {
      router.push('/admin/secretary')
    }
    if (user?.designation === 'Developer') {
      fetchPendingUsers()
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
      console.error("Failed to fetch pending users")
    } finally {
      setLoadingUsers(false)
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

  if (loading || !user) {
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
        res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, message: content })
        })
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
        setMessage('Published successfully!')
        setTitle('')
        setContent('')
        setThumbnailUrl('')
        setMediaFile(null)
      } else {
        const error = await res.json()
        setMessage(error.error || 'Failed to publish')
      }
    } catch (err) {
      setMessage('An unexpected error occurred.')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="section container" style={{ marginTop: '80px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#111', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-1px' }}>{user.designation} Dashboard</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.8rem' }}>Welcome back, <strong style={{color: 'var(--color-primary)'}}>{user.full_name}</strong></p>
        </div>
        <button onClick={logout} style={{ padding: '0.7rem 1.8rem', border: 'none', color: '#fff', backgroundColor: 'var(--color-primary)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)'; }}>
          Sign Out
        </button>
      </div>

      {user.designation === 'Developer' && (
        <div style={{ backgroundColor: '#fff3cd', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(133,100,4,0.05)', marginBottom: '3rem', border: '1px solid #ffeeba' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', color: '#856404', fontWeight: '800', letterSpacing: '-0.5px' }}>Pending Account Approvals</h2>
          {loadingUsers ? <p>Loading...</p> : pendingUsers.length === 0 ? <p style={{ color: '#856404' }}>No pending approvals.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pendingUsers.map(u => (
                <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{u.full_name}</strong> <span style={{ background: '#f5f5f5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>{u.designation}</span><br/>
                    <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>{u.email} | {u.mobile}</small>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleApproval(u.id, 'approve')} style={{ padding: '0.6rem 1.2rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(40,167,69,0.3)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>Approve</button>
                    <button onClick={() => handleApproval(u.id, 'revoke')} style={{ padding: '0.6rem 1.2rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.3)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>Revoke</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%)', padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,0,0,0.03) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        
        <h2 style={{ marginBottom: '2.5rem', fontSize: '1.8rem', color: '#111', fontWeight: '800', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>
          {user.designation === 'Pastor' ? 'Write a new Blog/Message' : 
           user.designation === 'Secretary' ? 'Post an Announcement' : 
           'Broadcast Emergency Info'}
        </h2>
        
        {message && (
          <div style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: message.includes('success') ? '#e6ffe6' : '#ffe6e6', color: message.includes('success') ? '#006600' : '#cc0000', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '500' }}>
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
            {submitLoading ? 'Publishing...' : 'Publish Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
