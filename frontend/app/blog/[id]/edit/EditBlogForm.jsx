'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditBlogForm({ post }) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnail || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch(`/api/blogs/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, thumbnail_url: thumbnailUrl })
      })
      
      if (res.ok) {
        setMessage('Article updated successfully!')
        router.push(`/blog/${post.id}`)
        router.refresh()
      } else {
        const error = await res.json()
        setMessage(error.error || 'Failed to update article')
      }
    } catch (err) {
      setMessage('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message && (
        <div style={{ padding: '1rem', backgroundColor: message.includes('success') ? '#e6ffe6' : '#ffe6e6', color: message.includes('success') ? '#006600' : '#cc0000', borderRadius: 'var(--radius-md)' }}>
          {message}
        </div>
      )}

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
        <input 
          type="text" 
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem' }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Thumbnail URL (Optional)</label>
        <input 
          type="url" 
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem' }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content</label>
        <textarea 
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'var(--font-body)', fontSize: '1rem', minHeight: '300px', resize: 'vertical' }} 
        />
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', flex: 1, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <Link href={`/blog/${post.id}`} className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: '#666', flex: 1, textAlign: 'center', textDecoration: 'none' }}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
