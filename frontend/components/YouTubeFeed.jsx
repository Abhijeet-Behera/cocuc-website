'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './YouTubeFeed.module.css'

export default function YouTubeFeed() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${API_URL}/youtube.php`)
        if (!res.ok) {
          console.warn("Failed to load videos: HTTP " + res.status)
          setVideos([])
          return
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setVideos(data)
        } else {
          console.warn('API did not return an array:', data)
          setVideos([])
        }
      } catch (err) {
        console.warn("Failed to load videos", err)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  if (loading) return <div className={styles.loading}>Loading videos...</div>
  
  if (!Array.isArray(videos) || videos.length === 0) return <div className={styles.empty}>No videos available at the moment. Please configure your YouTube API Key.</div>

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0, 
      transition: { type: 'spring', stiffness: 120, damping: 14 } 
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
      {videos.map((video, index) => (
        <motion.a 
          variants={itemVariants}
          key={video.video_id} 
          href={video.watch_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.card}
          whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
        >
          <div className={styles.imageWrapper}>
            <img 
              src={video.thumbnail_url} 
              alt={video.title} 
              className={styles.image} 
            />
            {/* Play Button Overlay */}
            <div className={styles.playButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            </div>
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {video.title}
            </h3>
            <p className={styles.description}>
              {video.description}
            </p>
          </div>
        </motion.a>
      ))}
    </motion.div>
  )
}
