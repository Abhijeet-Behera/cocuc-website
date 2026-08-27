'use client'

import { useState, useEffect } from 'react'
import styles from './BroadcastMarquee.module.css'

export default function BroadcastMarquee() {
  const [broadcast, setBroadcast] = useState(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const res = await fetch(`${API_URL}/broadcast.php`)
        if (!res.ok) {
          console.warn('Failed to fetch broadcast: HTTP ' + res.status)
          return
        }
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          // Check if broadcast is not older than 7 days (optional, but good practice)
          const latest = data[0]
          const broadcastDate = new Date(latest.created_at)
          const now = new Date()
          const diffTime = Math.abs(now - broadcastDate)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays <= 7) { // Show broadcast if it's from the last 7 days
            setBroadcast(latest)
          }
        }
      } catch (e) {
        console.warn('Failed to fetch broadcast', e)
      }
    }
    fetchBroadcast()
  }, [API_URL])

  if (!broadcast) return null

  return (
    <div id="broadcast-marquee" className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {[...Array(10)].map((_, i) => (
          <span key={i} className={styles.marqueeText}>
            <span className={styles.badge}>EMERGENCY UPDATE: {broadcast.title}</span> 
            <span className={styles.message}>{broadcast.message}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
