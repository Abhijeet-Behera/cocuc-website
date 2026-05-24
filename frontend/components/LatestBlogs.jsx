'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './LatestBlogs.module.css'

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs')
        const data = await res.json()
        if (Array.isArray(data)) {
          setBlogs(data)
        } else {
          console.error('API did not return an array:', data)
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

  if (loading) return <div className={styles.loading}>Loading articles...</div>
  
  if (!Array.isArray(blogs) || blogs.length === 0) return <div className={styles.empty}>No articles published yet.</div>

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={styles.grid}
    >
      {blogs.slice(0, 3).map((blog) => (
        <motion.article 
          variants={itemVariants}
          key={blog.id} 
          className={`card ${styles.article}`}
        >
          {blog.thumbnail ? (
            <div className={styles.imageContainer}>
              <img src={blog.thumbnail} alt={blog.title} className={styles.image} />
            </div>
          ) : (
            <div className={styles.fallbackImage}>
               <h3 className={styles.fallbackTitle}>{blog.title}</h3>
            </div>
          )}
          
          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.author}>
                {blog.authorTitle}
              </span>
              <span className={styles.date}>
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h3 className={styles.title}>{blog.title}</h3>
            <p className={styles.excerpt}>
              {blog.content}
            </p>
            <div className={styles.readMoreContainer}>
              <a href={`/blog/${blog.id}`} className={`hover-scale ${styles.readMore}`}>Read Article &rarr;</a>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
