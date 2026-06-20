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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>{user.designation} Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, {user.full_name}</p>
        </div>
        <button onClick={logout} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>

      {user.designation === 'Developer' && (
        <div style={{ backgroundColor: '#fff3cd', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem', border: '1px solid #ffeeba' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#856404' }}>Pending Account Approvals</h2>
          {loadingUsers ? <p>Loading...</p> : pendingUsers.length === 0 ? <p style={{ color: '#856404' }}>No pending approvals.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pendingUsers.map(u => (
                <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fff', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div>
                    <strong>{u.full_name}</strong> ({u.designation})<br/>
                    <small>{u.email} | {u.mobile}</small>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleApproval(u.id, 'approve')} style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => handleApproval(u.id, 'revoke')} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Revoke</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
          {user.designation === 'Pastor' ? 'Write a new Blog/Message' : 
           user.designation === 'Secretary' ? 'Post an Announcement' : 
           'Broadcast Emergency Info'}
        </h2>
        
        {message && (
          <div style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: message.includes('success') ? '#e6ffe6' : '#ffe6e6', color: message.includes('success') ? '#006600' : '#cc0000', borderRadius: 'var(--radius-md)' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem' }} 
              placeholder="Title"
            />
          </div>
          
          {user.designation !== 'Developer' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Upload Media (Image/Video)</label>
              <input 
                type="file" 
                onChange={(e) => setMediaFile(e.target.files[0])}
                style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem' }} 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content / Message</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem', minHeight: '300px', resize: 'vertical' }} 
              placeholder="Write your message here..."
            />
          </div>
          <button type="submit" disabled={submitLoading} className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', opacity: submitLoading ? 0.7 : 1, cursor: 'pointer', border: 'none' }}>
            {submitLoading ? 'Publishing...' : 'Publish Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
