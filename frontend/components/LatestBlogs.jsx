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
        const res = await fetch(`${API_URL}/blogs.php`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setBlogs(data)
        } else {
          console.warn('API did not return an array, falling back to empty list.')
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
  
  if (!Array.isArray(blogs) || blogs.length === 0) return <div className={styles.empty}>No articles published yet.</div>

  return (
    <div ref={containerRef} className={styles.grid}>
      {blogs.slice(0, 3).map((blog) => (
        <article key={blog.id} className={styles.article}>
          <Link href={`/blog/${blog.id}`} style={{ display: 'contents' }}>
            {blog.thumbnail_path ? (
              <div className={styles.imageContainer}>
                <img src={blog.thumbnail_path} alt={blog.title} className={styles.image} />
              </div>
            ) : (
              <div className={styles.fallbackImage}>
                 <h3 className={styles.fallbackTitle}>{blog.title}</h3>
              </div>
            )}
            
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.author}>
                  {blog.author_role}
                </span>
                <span className={styles.date}>
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className={styles.title}>{blog.title}</h3>
              <p className={styles.excerpt}>
                {blog.content}
              </p>
              <div className={styles.readMoreContainer}>
                <span className={styles.readMore}>Read Article &rarr;</span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
