'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import styles from './LatestBlogs.module.css'

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'
        const res = await fetch(`${API_URL}/announcements.php`)
        if (!res.ok) {
          console.warn("Failed to load blogs: HTTP " + res.status)
          setBlogs([])
          return
        }
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          if (Array.isArray(data)) {
            setBlogs(data)
          } else {
            console.warn('API did not return an array, falling back to empty list.')
            setBlogs([])
          }
        } catch (e) {
          console.warn("Failed to parse blogs JSON:", text)
          setBlogs([])
        }
      } catch (err) {
        console.warn("Failed to load blogs", err)
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
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
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
  
  if (!Array.isArray(blogs) || blogs.length === 0) return <div className={styles.empty}>No articles published yet.</div>

  return (
    <div ref={containerRef} className={styles.grid}>
      {blogs.slice(0, 3).map((blog) => (
        <article key={blog.id} className={styles.article}>
          <Link href={`#`} style={{ display: 'contents' }}>
            {blog.media_path ? (
              <div className={styles.imageContainer}>
                {blog.media_type === 'video' ? (
                  <video src={blog.media_path} className={styles.image} muted loop playsInline />
                ) : (
                  <img src={blog.media_path} alt={blog.title} className={styles.image} />
                )}
              </div>
            ) : (
              <div className={styles.fallbackImage}>
                 <h3 className={styles.fallbackTitle}>{blog.title}</h3>
              </div>
            )}
            
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.author}>{blog.author_role}</span>
                <span className={styles.metaDot} />
                <span className={styles.date}>
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className={styles.title}>{blog.title}</h3>
              <p className={styles.excerpt}>{blog.content}</p>
              <div className={styles.readMoreContainer}>
                <span className={styles.readMore}>Read Article →</span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
