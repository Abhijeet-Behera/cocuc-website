'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/AuthContext'
import AdminBlogControls from '@/components/AdminBlogControls'

function BlogContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { user } = useAuth()
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return;
    
    async function fetchPost() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'
        // Since our blogs.php currently returns ALL blogs, we'll fetch all and find the one. 
        // In a real scenario we'd add ?id= to blogs.php, but this is a quick fix.
        const res = await fetch(`${API_URL}/blogs.php`)
        const data = await res.json()
        const foundPost = data.find(p => p.id == id)
        
        if (foundPost) setPost(foundPost)
        else setError('Post not found')
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) return <div className="section container" style={{ marginTop: '100px', textAlign: 'center' }}>Loading...</div>
  if (error || !post) return <div className="section container" style={{ marginTop: '100px', textAlign: 'center' }}>{error || "Post not found"}</div>

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Hero Header */}
      <section style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '150px 0 80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{ display: 'inline-block', backgroundColor: 'var(--color-primary-light)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
            {post.author_role}
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', opacity: 0.9, fontSize: '1.1rem' }}>
            <span>By {post.author_name}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container" style={{ maxWidth: '800px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
          {/* Images Grid */}
          {(post.image1_path || post.image2_path) && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: post.image1_path && post.image2_path ? '1fr 1fr' : '1fr', 
              gap: '1.5rem', 
              marginBottom: '3rem' 
            }}>
              {post.image1_path && (
                <div style={{ width: '100%', aspectRatio: post.image1_path && post.image2_path ? '16/9' : 'auto', maxHeight: '500px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={post.image1_path} alt={post.title} style={{ width: '100%', height: '100%', objectFit: post.image1_path && post.image2_path ? 'cover' : 'contain' }} />
                </div>
              )}
              {post.image2_path && (
                <div style={{ width: '100%', aspectRatio: post.image1_path && post.image2_path ? '16/9' : 'auto', maxHeight: '500px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={post.image2_path} alt={post.title} style={{ width: '100%', height: '100%', objectFit: post.image1_path && post.image2_path ? 'cover' : 'contain' }} />
                </div>
              )}
            </div>
          )}
          
          <div style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <Link href="/#sermons" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }} className="hover-scale">
              &larr; Back to Home
            </Link>
            
            {/* Admin Controls */}
            {user && user.id === post.author_id && (
              <AdminBlogControls postId={post.id} />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function BlogPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  )
}
