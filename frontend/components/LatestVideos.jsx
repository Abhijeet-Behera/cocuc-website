'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { VIDEO_SECTIONS } from '@/lib/youtubeConfig'
import VideoRow from './VideoRow'
import styles from './LatestVideos.module.css'

const LAYOUTS = ['text-left', 'text-right', 'text-left']

export default function LatestVideos() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const headerRef = useRef(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'
        const res = await fetch(`${API_URL}/youtube.php`)
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true
          }
        }
      )
    }, headerRef)

    return () => ctx.revert()
  }, [])

  // Map the top 3 fetched videos to our 3 layout sections
  const rows = VIDEO_SECTIONS.map((section, i) => {
    let videoObj = null;
    if (results[i]) {
      videoObj = {
        title: results[i].title,
        thumbnail: results[i].thumbnail_url,
        watchUrl: results[i].watch_url,
        videoId: results[i].video_id,
      };
    }
    return {
      ...section,
      layout: LAYOUTS[i],
      video: videoObj,
    }
  })

  return (
    <div className={styles.wrapper}>
      <div
        ref={headerRef}
        className={styles.sectionHeader}
      >
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleNormal}>Latest </span>
          <em className={styles.titleItalic}>Videos</em>
        </h2>
        <p className={styles.sectionSubtitle}>
          Watch our recent messages, devotionals, and community broadcasts.
        </p>
      </div>

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
