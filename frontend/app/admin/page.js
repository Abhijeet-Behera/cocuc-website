'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function AdminPortal() {
  const { data: session, status } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (status === 'loading') {
    return <div className="section container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="section container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Admin Portal</h1>
        <p style={{ marginBottom: '2rem' }}>Please sign in to access the pastor dashboard.</p>
        <button onClick={() => signIn()} className="btn-primary" style={{ padding: '1rem 3rem' }}>Sign In</button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, thumbnail_url: thumbnailUrl })
      })
      
      if (res.ok) {
        setMessage('Blog published successfully!')
        setTitle('')
        setContent('')
        setThumbnailUrl('')
      } else {
        const error = await res.json()
        setMessage(error.error || 'Failed to publish blog')
      }
    } catch (err) {
      setMessage('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section container" style={{ marginTop: '80px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>Pastor Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, {session.user.name} ({session.user.role})</p>
        </div>
        <button onClick={() => signOut()} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'transparent', borderRadius: 'var(--radius-md)' }}>
          Sign Out
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Write a new message</h2>
        
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
              placeholder="Sermon or Blog Title"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Thumbnail URL (Optional)</label>
            <input 
              type="url" 
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem' }} 
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem', minHeight: '300px', resize: 'vertical' }} 
              placeholder="Write your message here..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Publishing...' : 'Publish Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
