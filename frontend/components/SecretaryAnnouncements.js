'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import styles from './ChurchUpdates.module.css'

const CARD_CONFIG = [
  {
    key: 'weekly',
    title: 'Weekly Notices',
    image: '/images/church-updates/church-updates-notices.svg',
    alt: 'Clipboard with church bulletin notices',
    label: 'NOTICES',
  },
  {
    key: 'special',
    title: 'Special Programmes',
    image: '/images/church-updates/church-updates-programmes.svg',
    alt: 'Calendar showing church event dates',
    label: 'PROGRAMMES',
  },
  {
    key: 'speaking',
    title: 'Speaking Arrangements',
    image: '/images/church-updates/church-updates-speaking.svg',
    alt: 'Pulpit with Bible and microphone',
    label: 'SPEAKING',
  },
]

export default function SecretaryAnnouncements() {
  const [weeklyNotices, setWeeklyNotices] = useState([])
  const [specialProgrammes, setSpecialProgrammes] = useState([])
  const [speakingArrangements, setSpeakingArrangements] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState({})

  const cardRefs = useRef([])
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'
    Promise.all([
      fetch(`${API_URL}/weekly_notices.php`).then(res => res.json()),
      fetch(`${API_URL}/special_programmes.php`).then(res => res.json()),
      fetch(`${API_URL}/speaking_arrangements.php`).then(res => res.json())
    ])
    .then(([weekly, special, speaking]) => {
      if(Array.isArray(weekly)) setWeeklyNotices(weekly)
      if(Array.isArray(special)) setSpecialProgrammes(special)
      if(Array.isArray(speaking)) setSpeakingArrangements(speaking)
      setLoading(false)
    })
    .catch(err => {
      console.error("Failed to load secretary announcements", err)
      setLoading(false)
    })
  }, [])

  // Pointer-based tilt effect
  useEffect(() => {
    // Check for reduced motion preference
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mql.matches

    const handleMotionChange = (e) => {
      prefersReducedMotion.current = e.matches
      // Reset all cards if reduced motion is enabled
      if (e.matches) {
        cardRefs.current.forEach(card => {
          if (card) card.style.transform = ''
        })
      }
    }
    mql.addEventListener('change', handleMotionChange)

    // Check if device supports hover (skip tilt on touch-only devices)
    const hasHover = window.matchMedia('(hover: hover)').matches
    if (!hasHover) {
      return () => mql.removeEventListener('change', handleMotionChange)
    }

    const handlers = []

    cardRefs.current.forEach((card) => {
      if (!card) return

      const handlePointerMove = (e) => {
        if (prefersReducedMotion.current) return

        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Calculate tilt angles (max ~10 degrees)
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        card.style.transform =
          `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      }

      const handlePointerLeave = () => {
        card.style.transform = ''
      }

      card.addEventListener('pointermove', handlePointerMove)
      card.addEventListener('pointerleave', handlePointerLeave)

      handlers.push({ card, handlePointerMove, handlePointerLeave })
    })

    return () => {
      mql.removeEventListener('change', handleMotionChange)
      handlers.forEach(({ card, handlePointerMove, handlePointerLeave }) => {
        card.removeEventListener('pointermove', handlePointerMove)
        card.removeEventListener('pointerleave', handlePointerLeave)
      })
    }
  }, [loading]) // Re-attach after loading completes and cards render

  const toggleExpanded = useCallback((key) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const getDataForCard = (key) => {
    switch (key) {
      case 'weekly': return weeklyNotices
      case 'special': return specialProgrammes
      case 'speaking': return speakingArrangements
      default: return []
    }
  }

  const renderCardContent = (key, data, expanded) => {
    if (data.length === 0) {
      switch (key) {
        case 'weekly': return <p className={styles.churchUpdateEmpty}>No recent notices.</p>
        case 'special': return <p className={styles.churchUpdateEmpty}>No recent programmes.</p>
        case 'speaking': return <p className={styles.churchUpdateEmpty}>No recent arrangements.</p>
        default: return null
      }
    }

    const items = expanded ? data : data.slice(0, 2)

    return items.map(item => (
      <div key={item.id} className={styles.churchUpdateItem}>
        {key === 'weekly' && (
          <>
            <strong className={styles.churchUpdateItemTitle}>Notice</strong>
            <small className={styles.churchUpdateItemMeta}>
              Released: {new Date(item.release_date).toLocaleDateString()}
            </small>
            <br/>
            <small className={styles.churchUpdateItemHighlight}>
              {item.documents_json ? JSON.parse(item.documents_json).length : 0} Document(s) attached
            </small>
          </>
        )}
        {key === 'special' && (
          <>
            <strong className={styles.churchUpdateItemTitle}>{item.title}</strong>
            <small className={styles.churchUpdateItemMeta}>
              {item.wing === 'Others' ? item.custom_wing : item.wing}
            </small>
            <br/>
            <small className={styles.churchUpdateItemHighlight}>
              Date: {new Date(item.upload_date).toLocaleDateString()}
            </small>
          </>
        )}
        {key === 'speaking' && (
          <>
            <strong className={styles.churchUpdateItemTitle}>{item.sub_section}</strong>
            <small className={styles.churchUpdateItemMeta}>
              Event Date: {new Date(item.event_date).toLocaleDateString()}
            </small>
          </>
        )}
      </div>
    ))
  }

  if (loading) {
    return (
      <div className={styles.churchUpdatesLoading}>
        <p>Loading Latest Announcements...</p>
      </div>
    )
  }

  return (
    <section className={`section container ${styles.churchUpdatesSection}`}>
      <h2 className={styles.churchUpdatesHeading}>
        <span className={styles.churchUpdatesHeadingNormal}>Church </span>
        <em className={styles.churchUpdatesHeadingItalic}>Updates</em>
      </h2>

      <div className={styles.churchUpdatesGrid}>
        {CARD_CONFIG.map((config, index) => {
          const data = getDataForCard(config.key)
          const expanded = expandedCards[config.key]

          return (
            <div key={config.key} className={styles.churchUpdateCardWrapper}>
              <div
                className={styles.churchUpdateCard}
                ref={el => { cardRefs.current[index] = el }}
              >
                {/* Accent circle */}
                <div className={styles.churchUpdateCardAccent} aria-hidden="true" />

                {/* Floating image */}
                <Image
                  src={config.image}
                  alt={config.alt}
                  className={styles.churchUpdateCardImage}
                  width={120}
                  height={120}
                  loading="lazy"
                />

                {/* Title */}
                <h3 className={styles.churchUpdateCardTitle}>{config.title}</h3>

                {/* Background category label */}
                <span className={styles.churchUpdateCardLabel} aria-hidden="true">
                  {config.label}
                </span>

                {/* Content area */}
                <div className={styles.churchUpdateCardContent}>
                  {renderCardContent(config.key, data, expanded)}
                </div>

                {/* Read More button */}
                <button
                  className={styles.churchUpdateCardButton}
                  onClick={() => toggleExpanded(config.key)}
                  aria-expanded={!!expanded}
                  aria-label={`${expanded ? 'Show less' : 'Read more'} ${config.title}`}
                >
                  {expanded ? 'Show Less' : 'Read More'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
