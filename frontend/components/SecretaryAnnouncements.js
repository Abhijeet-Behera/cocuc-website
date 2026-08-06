'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
    key: 'speaking',
    title: 'Speaking Arrangements',
    image: '/images/church-updates/church-updates-speaking.svg',
    alt: 'Pulpit with Bible and microphone',
    label: 'SPEAKING',
  },
  {
    key: 'special',
    title: 'Special Programmes',
    image: '/images/church-updates/church-updates-programmes.svg',
    alt: 'Calendar showing church event dates',
    label: 'PROGRAMMES',
  },
]


const EMPTY_STATE_CONFIG = {
  weekly: {
    title: 'No notices published yet',
    text: 'Please check back after the next Sunday update.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  },
  special: {
    title: 'No programmes scheduled yet',
    text: 'Upcoming church programmes will appear here soon.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  },
  speaking: {
    title: 'No arrangements available yet',
    text: 'Speaking arrangements will be updated shortly.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  },
}

const SPEAKING_MOTIVATION_STYLES = {
  card: {
    position: 'relative',
    width: '100%',
    minHeight: '230px',
    padding: '28px 24px',
    border: '1px solid rgba(153, 0, 0, 0.12)',
    borderRadius: '20px',
    background:
      'linear-gradient(145deg, rgba(255, 248, 248, 0.98), rgba(255, 255, 255, 1))',
    boxShadow:
      '0 14px 35px rgba(80, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.03)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    position: 'relative',
    zIndex: 1,
    width: '50px',
    height: '50px',
    marginBottom: '16px',
    borderRadius: '50%',
    background: 'rgba(153, 0, 0, 0.07)',
    color: '#990000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  title: {
    position: 'relative',
    zIndex: 1,
    margin: '0 0 12px',
    color: '#990000',
    fontSize: '17px',
    fontWeight: 800,
    lineHeight: 1.3,
  },
  text: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '520px',
    margin: '0 0 22px',
    color: '#555555',
    fontSize: '15px',
    lineHeight: 1.65,
  },
}
const getFileType = (path) => {
  if (!path) return 'none'

  const ext = path.split('.').pop().toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) {
    return 'image'
  }

  return 'document'
}

export default function SecretaryAnnouncements() {
  const router = useRouter()
  const [weeklyNotices, setWeeklyNotices] = useState([])
  const [specialProgrammes, setSpecialProgrammes] = useState([])
  const [speakingArrangements, setSpeakingArrangements] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState({})

  const [activeModal, setActiveModal] = useState(null)
  const [mounted, setMounted] = useState(false)

  const cardRefs = useRef([])
  const prefersReducedMotion = useRef(false)
  const panelRef = useRef(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    setMounted(true)
  }, [])

  const getAttachmentUrl = (path) => {
    if (!path) return ''

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    const baseUrl = API_URL.replace(/\/api\/?$/, '')
    return `${baseUrl}${path}`
  }

  const getWeeklyNoticeDocumentUrl = (notice) => {
    if (!notice?.documents_json) return ''

    let documents = []

    try {
      documents = JSON.parse(notice.documents_json)
    } catch (error) {
      documents = []
    }

    if (!Array.isArray(documents) || documents.length === 0) return ''

    const firstDocument = documents[0]

    const documentPath =
      typeof firstDocument === 'string'
        ? firstDocument
        : firstDocument?.path || firstDocument?.document_path || firstDocument?.url || ''

    return documentPath ? getAttachmentUrl(documentPath) : ''
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null)
      }
    }

    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeModal])

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

    Promise.all([
      fetch(`${API_URL}/weekly_notices.php`).then(res => res.json()),
      fetch(`${API_URL}/special_programmes.php`).then(res => res.json()),
      fetch(`${API_URL}/speaking_arrangements.php`).then(res => res.json()),
    ])
      .then(([weekly, special, speaking]) => {
        if (Array.isArray(weekly)) setWeeklyNotices(weekly)
        if (Array.isArray(special)) setSpecialProgrammes(special)
        if (Array.isArray(speaking)) setSpeakingArrangements(speaking)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load secretary announcements', err)
        setLoading(false)
      })
  }, [])

  // Pointer-based tilt effect
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mql.matches

    const handleMotionChange = (e) => {
      prefersReducedMotion.current = e.matches

      if (e.matches) {
        cardRefs.current.forEach(card => {
          if (card) card.style.transform = ''
        })
      }
    }

    mql.addEventListener('change', handleMotionChange)

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
  }, [loading])

  const toggleExpanded = useCallback((key) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const getDataForCard = (key) => {
    switch (key) {
      case 'weekly':
        return weeklyNotices
      case 'special':
        return specialProgrammes
      case 'speaking':
        return speakingArrangements
      default:
        return []
    }
  }

  const renderCardContent = (key, data, expanded) => {
    if (key === 'speaking') {
      return (
        <div style={SPEAKING_MOTIVATION_STYLES.card}>
          <div
            style={SPEAKING_MOTIVATION_STYLES.icon}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>

          <strong style={SPEAKING_MOTIVATION_STYLES.title}>
            Stay Connected with Every Gathering
          </strong>

          {/* <span style={SPEAKING_MOTIVATION_STYLES.text}>
            Every service carries a message, and every gathering has a purpose.
            Explore all worship services, prayer meetings, Bible studies, and
            upcoming speaking arrangements in one place.
          </span>*/}

          <Link
            href="/speaking-arrangements"
            className={styles.speakingArrangementsBtn}
          >
            View All Arrangements
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )
    }

    if (data.length === 0) {
      const emptyState = EMPTY_STATE_CONFIG[key]

      if (!emptyState) return null

      return (
        <div className={styles.churchUpdateEmptyState}>
          <div className={styles.churchUpdateEmptyIcon}>
            {emptyState.icon}
          </div>

          <strong className={styles.churchUpdateEmptyTitle}>
            {emptyState.title}
          </strong>

          <span className={styles.churchUpdateEmptyText}>
            {emptyState.text}
          </span>
        </div>
      )
    }

    const items = expanded ? data : data.slice(0, 2)

    if (key === 'weekly') {
      return items.map(item => {
        let documents = []

        try {
          documents = item.documents_json ? JSON.parse(item.documents_json) : []
        } catch (error) {
          documents = []
        }

        const documentCount = Array.isArray(documents) ? documents.length : 0

        return (
          <div key={item.id} className={styles.weeklyNoticePreviewItem}>
            <div className={styles.weeklyNoticePreviewIcon}>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
            </div>

            <div className={styles.weeklyNoticePreviewText}>
              <strong className={styles.weeklyNoticePreviewTitle}>
                Notice for {new Date(item.release_date).toLocaleDateString()}
              </strong>

              <small className={styles.weeklyNoticePreviewCount}>
                {documentCount} PDF/Document{documentCount === 1 ? '' : 's'} attached
              </small>
            </div>
          </div>
        )
      })
    }

    if (key === 'special') {
      return items.map(item => {
        const fileType = getFileType(item.document_path)
        const imageUrl = fileType === 'image' ? getAttachmentUrl(item.document_path) : ''

        return (
          <div key={item.id} className={styles.specialProgrammePreviewItem}>
            <div className={styles.specialProgrammePreviewThumb}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title || 'Special Programme'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'

                    const fallback = e.currentTarget.nextElementSibling
                    if (fallback) {
                      fallback.style.display = 'flex'
                    }
                  }}
                />
              ) : null}

              <div
                className={styles.specialProgrammePreviewPlaceholder}
                style={{ display: imageUrl ? 'none' : 'flex' }}
              >
                Event
              </div>
            </div>

            <div className={styles.specialProgrammePreviewText}>
              <strong className={styles.specialProgrammePreviewTitle}>
                {item.title}
              </strong>

              <small className={styles.specialProgrammePreviewWing}>
                {item.wing === 'Others' ? item.custom_wing : item.wing}
              </small>

              <small className={styles.specialProgrammePreviewDate}>
                Date: {new Date(item.upload_date).toLocaleDateString()}
              </small>
            </div>
          </div>
        )
      })
    }

    return items.map(item => (
      <div key={item.id} className={styles.churchUpdateItem}>
        {key === 'speaking' && (
          <>
            <strong className={styles.churchUpdateItemTitle}>
              {item.sub_section}
            </strong>

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
          const isSpecial = config.key === 'special'

          return (
            <div
              key={config.key}
              className={styles.churchUpdateCardWrapper}
            >
              <div
                className={styles.churchUpdateCard}
                ref={el => {
                  cardRefs.current[index] = el
                }}
              >
                <div
                  className={styles.churchUpdateCardAccent}
                  aria-hidden="true"
                />

                <Image
                  src={config.image}
                  alt={config.alt}
                  className={styles.churchUpdateCardImage}
                  width={120}
                  height={120}
                  loading="lazy"
                />

                <h3 className={styles.churchUpdateCardTitle}>
                  {config.title}
                </h3>

                <span
                  className={styles.churchUpdateCardLabel}
                  aria-hidden="true"
                >
                  {config.label}
                </span>

                <div className={styles.churchUpdateCardContent}>
                  {renderCardContent(config.key, data, expanded)}
                </div>

                {config.key !== 'speaking' && (
                  <button
                    className={styles.churchUpdateCardButton}
                    onClick={(e) => {
                      e.stopPropagation()

                      if (config.key === 'weekly') {
                        const noticeUrl = getWeeklyNoticeDocumentUrl(data[0])

                        if (noticeUrl) {
                          window.open(noticeUrl, '_blank', 'noopener,noreferrer')
                        } else {
                          setActiveModal('weekly')
                        }
                        return
                      }

                      if (isSpecial) {
                        setActiveModal('special')
                      } else if (config.key === 'speaking') {
                        router.push('/speaking-arrangements')
                      } else {
                        toggleExpanded(config.key)
                      }
                    }}
                    aria-expanded={isSpecial ? activeModal === 'special' : !!expanded}
                    aria-label={
                      config.key === 'weekly'
                        ? `Read notice ${config.title}`
                        : `${(isSpecial ? activeModal === 'special' : expanded) ? 'Show less' : 'Read more'} ${config.title}`
                    }
                  >
                    {config.key === 'weekly'
                      ? 'Read Notice'
                      : 'Read More'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {mounted && createPortal(
        <>
          <div
            className={`${styles.specialBackdrop} ${activeModal ? styles.specialBackdropOpen : ''}`}
            onClick={() => setActiveModal(null)}
          />

          <div
            ref={panelRef}
            className={`${styles.specialPanel} ${activeModal ? styles.specialPanelOpen : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.specialPanelHeader}>
              <h2 className={styles.specialPanelTitle}>
                {activeModal === 'weekly' ? 'Weekly Notices' : 'Special Programmes'}
              </h2>

              <button
                className={styles.specialPanelCloseBtn}
                onClick={() => setActiveModal(null)}
                aria-label="Close panel"
              >
                &times;
              </button>
            </div>

            <div className={styles.specialPanelGrid}>
              {activeModal === 'weekly' ? (
                <div className={styles.specialPanelEmpty}>
                  <p>No notices are currently published. Please check back after the next Sunday update.</p>
                </div>
              ) : specialProgrammes.length === 0 ? (
                <div className={styles.specialPanelEmpty}>
                  <p>No special programmes are currently scheduled.</p>
                </div>
              ) : (
                specialProgrammes.map((item) => {
                  const fileType = getFileType(item.document_path)
                  const hasAttachment = !!item.document_path

                  return (
                    <div key={item.id} className={styles.progCard}>
                      <div className={styles.progCardImageContainer}>
                        {fileType === 'image' ? (
                          <Image
                            src={getAttachmentUrl(item.document_path)}
                            alt={item.title || 'Special Programme'}
                            className={styles.progCardImage}
                            width={300}
                            height={200}
                            unoptimized
                          />
                        ) : fileType === 'document' ? (
                          <div className={styles.progCardPlaceholder}>
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>

                            <span className={styles.placeholderLabel}>
                              Document Attached
                            </span>
                          </div>
                        ) : (
                          <div className={styles.progCardPlaceholder}>
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>

                            <span className={styles.placeholderLabel}>
                              Special Event
                            </span>
                          </div>
                        )}

                        <span className={styles.progCardWingTag}>
                          {item.wing === 'Others' ? item.custom_wing : item.wing}
                        </span>
                      </div>

                      <div className={styles.progCardBody}>
                        <h3 className={styles.progTitle}>
                          {item.title}
                        </h3>

                        <div className={styles.progCardMetaGroup}>
                          {item.event_from && (
                            <div className={styles.metaRow}>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>

                              <span>
                                {new Date(item.event_from).toLocaleDateString()}
                                {item.event_to && ` - ${new Date(item.event_to).toLocaleDateString()}`}
                              </span>
                            </div>
                          )}

                          {item.duration && (
                            <div className={styles.metaRow}>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                              </svg>

                              <span>
                                Duration: {item.duration}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={styles.progDetailsExpanded}>
                          {item.details && (
                            <p className={styles.progDetailsContent}>
                              {item.details}
                            </p>
                          )}

                          {item.upload_date && (
                            <div className={styles.progUploadDate}>
                              Uploaded: {new Date(item.upload_date).toLocaleDateString()}
                            </div>
                          )}

                          {hasAttachment && (
                            <a
                              href={getAttachmentUrl(item.document_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.progDownloadBtn}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>

                              View Attachment
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </section>
  )
}