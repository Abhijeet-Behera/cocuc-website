'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './UpcomingEvents.module.css'

/**
 * LIMITATION:
 * YouTube API returns both Upcoming Premieres and Upcoming Livestreams
 * as upcoming broadcast content. Since the API does not provide a fully
 * reliable server-side way to separate them, we display both together
 * as "Upcoming Events" on the website.
 */
export default function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const sectionRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${API_URL}/upcoming.php`)
        const data = await res.json()

        if (Array.isArray(data)) {
          setEvents(data)
        } else if (data && data.error) {
          console.error('[UpcomingEvents] API error:', data.message)
          setError(true)
          setEvents([])
        } else {
          setEvents([])
        }
      } catch (err) {
        console.error('[UpcomingEvents] Failed to fetch:', err)
        setError(true)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchUpcoming()
  }, [])

  // GSAP scroll-triggered animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Header animation
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Animate cards once loaded
  useEffect(() => {
    if (!loading && events.length > 0) {
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo(`.${styles.card}`,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true
            }
          }
        )
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [loading, events])

  /**
   * Format a scheduled date/time for display.
   * Example: "June 8, 2026 · 10:00 AM"
   */
  function formatScheduledDate(isoString) {
    if (!isoString) return 'Date to be announced'
    const date = new Date(isoString)
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    return `${dateStr} · ${timeStr}`
  }

  return (
    <div ref={sectionRef} className={styles.wrapper}>
      {/* Section Header */}
      <div ref={headerRef} className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleNormal}>Upcoming </span>
          <em className={styles.titleItalic}>Events</em>
        </h2>
        <p className={styles.sectionSubtitle}>
          Scheduled livestreams and premieres from our YouTube channel.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.skeletonThumb} />
              <div className={styles.cardBody}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDate} />
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Empty / Error State */}
      {!loading && (error || events.length === 0) && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <h3 className={styles.emptyTitle}>
            Stay Connected for Upcoming Events
          </h3>

          <p className={styles.emptyText}>
            New livestreams and Premieres will appear here as soon as they are
            scheduled. Please stay connected with us.
          </p>

          <blockquote className={styles.bibleVerse}>
            “To every thing there is a season, and a time to every purpose under
            the heaven.”
            <cite>Ecclesiastes 3:1</cite>
          </blockquote>
        </div>
      )}



      {/* Event Cards */}
      {!loading && events.length > 0 && (
        <div className={styles.grid}>
          {events.map((event) => (
            <a
              key={event.video_id}
              href={event.watch_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.thumbWrapper}>
                {event.thumbnail_url ? (
                  <img
                    src={event.thumbnail_url}
                    alt={event.title}
                    className={styles.thumbImg}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.thumbPlaceholder} />
                )}
                {/* Live badge */}
                <div className={styles.badge}>
                  <span className={styles.badgeDot} />
                  PREMIERE
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <div className={styles.cardDate}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{formatScheduledDate(event.scheduled_at)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
