'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { VIDEO_SECTIONS } from '@/lib/youtubeConfig'
import VideoRow from './VideoRow'
import styles from './LatestVideos.module.css'

const LAYOUTS = ['text-left', 'text-right', 'text-left']

export default function LatestVideos() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/latest-videos')
        const data = await res.json()
        if (Array.isArray(data)) {
          setResults(data)
        } else {
          console.error('[LatestVideos] Unexpected response:', data)
          setResults([])
        }
      } catch (err) {
        console.error('[LatestVideos] Failed to load videos:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Merge static config with fetched video data
  const rows = VIDEO_SECTIONS.map((section, i) => {
    const fetched = results.find((r) => r.key === section.key)
    return {
      ...section,
      layout: LAYOUTS[i],
      video: fetched?.video ?? null,
    }
  })

  return (
    <div className={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={styles.sectionHeader}
      >
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleNormal}>Latest </span>
          <em className={styles.titleItalic}>Videos</em>
        </h2>
        <p className={styles.sectionSubtitle}>
          Watch our recent messages, devotionals, and community broadcasts.
        </p>
      </motion.div>

      <div className={styles.rows}>
        {rows.map((row) => (
          <VideoRow
            key={row.key}
            heading={row.heading}
            description={row.description}
            buttonLabel={row.buttonLabel}
            playlistId={row.playlistId}
            layout={row.layout}
            video={row.video}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}
