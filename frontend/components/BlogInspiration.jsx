'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './BlogInspiration.module.css'

export default function BlogInspiration() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'
        const res = await fetch(`${API_URL}/blogs.php`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setBlogs(data)
        } else {
          setBlogs([])
        }
      } catch (err) {
        console.error("Failed to load blogs")
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      gsap.registerPlugin(ScrollTrigger)
      
      const ctx = gsap.context(() => {
        gsap.fromTo(`.${styles.article}`, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              once: true
            }
          }
        )
      }, containerRef)

      return () => ctx.revert()
    }
  }, [loading, blogs])

  if (loading) return (
    <div className={styles.loading}>
      <div className="jumping-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  )
  
  if (!Array.isArray(blogs) || blogs.length === 0) return null;

  return (
    <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {blogs.map((blog) => {
        const isExpanded = expandedId === blog.id;
        return (
          <article key={blog.id} id={`blog-${blog.id}`} className={styles.article} style={{ flexDirection: 'column', height: 'auto', padding: '2rem' }}>
            <div className={styles.meta} style={{ marginBottom: '1rem' }}>
              <span className={styles.author}>
                {blog.author_role.toUpperCase() === blog.author_name.toUpperCase() 
                  ? blog.author_role 
                  : `${blog.author_role} • ${blog.author_name}`}
              </span>
              <span className={styles.date}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <h3 className={styles.title} style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>{blog.title}</h3>
            
            {/* Images Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: blog.image1_path && blog.image2_path ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {blog.image1_path && (
                <img src={blog.image1_path} alt="Blog Attachment 1" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover', maxHeight: '400px' }} />
              )}
              {blog.image2_path && (
                <img src={blog.image2_path} alt="Blog Attachment 2" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover', maxHeight: '400px' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ color: '#444', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
              {isExpanded ? blog.content : (blog.content.length > 300 ? blog.content.substring(0, 300) + '...' : blog.content)}
            </div>

            {/* Read More / PDF Links */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              {blog.content.length > 300 && (
                <button 
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedId(null);
                      const el = document.getElementById(`blog-${blog.id}`);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    } else {
                      setExpandedId(blog.id);
                    }
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                >
                  {isExpanded ? 'Show Less' : 'Read Full Article'}
                </button>
              )}
              
              {blog.pdf_path && (
                <a 
                  href={blog.pdf_path} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '6px', color: '#333', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                  View Attachment (PDF)
                </a>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
