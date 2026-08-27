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
  const [activeDetailItem, setActiveDetailItem] = useState(null)
  const [activePdfViewer, setActivePdfViewer] = useState(null)
  const [mounted, setMounted] = useState(false)

  const cardRefs = useRef([])
  const prefersReducedMotion = useRef(false)
  const panelRef = useRef(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (activeModal || activeDetailItem || activePdfViewer) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModal, activeDetailItem, activePdfViewer])

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
        setActiveDetailItem(null)
      }
    }

    if (activeModal || activeDetailItem) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeModal, activeDetailItem])

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

    fetch(`${API_URL}/weekly_notices.php`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data)) setWeeklyNotices(data) })
      .catch(err => console.warn('Failed to load weekly notices', err))
      
    fetch(`${API_URL}/special_programmes.php`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data)) setSpecialProgrammes(data) })
      .catch(err => console.warn('Failed to load special programmes', err))
      
    fetch(`${API_URL}/speaking_schedules.php`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data)) setSpeakingArrangements(data) })
      .catch(err => console.warn('Failed to load speaking schedules', err))
      .finally(() => setLoading(false))
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
              {item.title || item.sub_section}
            </strong>

            <small className={styles.churchUpdateItemMeta}>
              Upload Date: {new Date(item.created_at || item.event_date).toLocaleDateString()}
            </small>
          </>
        )}
      </div>
    ))
  }

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (activeModal || activeDetailItem || activePdfViewer) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModal, activeDetailItem, activePdfViewer])

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
                        setActiveModal('speaking')
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
                {activeModal === 'weekly' ? 'Weekly Notices' : activeModal === 'special' ? 'Special Programmes' : 'Speaking Arrangements'}
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
                weeklyNotices.length === 0 ? (
                  <div className={styles.specialPanelEmpty}>
                    <p>No notices are currently published. Please check back after the next Sunday update.</p>
                  </div>
                ) : (
                  weeklyNotices.map((item) => {
                    const noticeUrl = getWeeklyNoticeDocumentUrl(item)
                    return (
                      <div 
                        key={item.id} 
                        className={styles.progCard}
                        onClick={() => setActiveDetailItem({ ...item, isWeekly: true, fileUrl: noticeUrl })}
                      >
                        <div className={styles.progCardImageContainer}>
                          <span className={styles.progCardWingTag} style={{ background: '#212529', color: '#fff', border: 'none' }}>
                            PDF
                          </span>
                          <div className={styles.progCardPlaceholder}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span className={styles.placeholderLabel}>Document Attached</span>
                          </div>
                          <div className={styles.progCardHoverOverlay}>
                            <span className={styles.progCardHoverText}>Click to view details</span>
                          </div>
                        </div>

                        <div className={styles.progCardBody}>
                          <h3 className={styles.progTitle}>
                            Notice for {new Date(item.release_date).toLocaleDateString()}
                          </h3>
                          
                          <div className={styles.progUploadDate}>
                            Uploaded: {new Date(item.release_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )
              ) : activeModal === 'speaking' ? (
                speakingArrangements.length === 0 ? (
                  <div className={styles.specialPanelEmpty}>
                    <p>No speaking arrangements are currently scheduled.</p>
                  </div>
                ) : (
                  speakingArrangements.map((item) => {
                    return (
                      <div 
                        key={item.id} 
                        className={styles.progCard}
                        onClick={() => setActiveDetailItem({ ...item, isSpeaking: true, document_path: item.pdf_file_path })}
                      >
                        <div className={styles.progCardImageContainer}>
                          <span className={styles.progCardWingTag} style={{ background: '#212529', color: '#fff', border: 'none' }}>
                            PDF
                          </span>
                          <div className={styles.progCardPlaceholder}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span className={styles.placeholderLabel}>Document Attached</span>
                          </div>
                          <div className={styles.progCardHoverOverlay}>
                            <span className={styles.progCardHoverText}>Click to view details</span>
                          </div>
                        </div>

                        <div className={styles.progCardBody}>
                          <h3 className={styles.progTitle}>
                            {item.title || item.sub_section}
                          </h3>
                          
                          <div className={styles.progUploadDate}>
                            Uploaded: {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )
              ) : specialProgrammes.length === 0 ? (
                <div className={styles.specialPanelEmpty}>
                  <p>No special programmes are currently scheduled.</p>
                </div>
              ) : (
                specialProgrammes.map((item) => {
                  const fileType = getFileType(item.document_path)
                  return (
                    <div 
                      key={item.id} 
                      className={styles.progCard}
                      onClick={() => setActiveDetailItem({ ...item, isSpecial: true })}
                    >
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
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span className={styles.placeholderLabel}>Document Attached</span>
                          </div>
                        ) : (
                          <div className={styles.progCardPlaceholder}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span className={styles.placeholderLabel}>Special Event</span>
                          </div>
                        )}

                        <span className={styles.progCardWingTag}>
                          {item.wing === 'Others' ? item.custom_wing : item.wing}
                        </span>
                        
                        <div className={styles.progCardHoverOverlay}>
                          <span className={styles.progCardHoverText}>Click to view details</span>
                        </div>
                      </div>

                      <div className={styles.progCardBody}>
                        <h3 className={styles.progTitle}>{item.title}</h3>

                        <div className={styles.progCardMetaGroup}>
                          {item.event_from && (
                            <div className={styles.metaRow}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              <span>
                                {new Date(item.event_from).toLocaleDateString()}
                                {item.event_to && ` - ${new Date(item.event_to).toLocaleDateString()}`}
                              </span>
                            </div>
                          )}

                          {item.duration && (
                            <div className={styles.metaRow}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <span>
                                Duration: {item.duration}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          
          {/* Full Screen Detail Modal */}
          {activeDetailItem && (
            <div className={styles.detailOverlay} onClick={() => setActiveDetailItem(null)}>
              <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.detailCloseBtn}
                  onClick={() => setActiveDetailItem(null)}
                  aria-label="Close details"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <div className={styles.detailPosterColumn}>
                  {activeDetailItem.isWeekly ? (
                    <div className={styles.progCardPlaceholder} style={{ background: '#212529', color: '#fff', opacity: 1 }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className={styles.placeholderLabel} style={{ color: '#fff', fontSize: '1.2rem', marginTop: '1rem' }}>Weekly Notice PDF</span>
                    </div>
                  ) : getFileType(activeDetailItem.document_path) === 'image' ? (
                    <img 
                      src={getAttachmentUrl(activeDetailItem.document_path)}
                      alt={activeDetailItem.title}
                      className={styles.detailPosterImage}
                    />
                  ) : getFileType(activeDetailItem.document_path) === 'document' ? (
                    <div className={styles.progCardPlaceholder}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className={styles.placeholderLabel} style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Document Attached</span>
                    </div>
                  ) : (
                    <div className={styles.progCardPlaceholder}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span className={styles.placeholderLabel} style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Special Event</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.detailContentColumn}>
                  <span className={styles.detailTagline}>
                    {activeDetailItem.isWeekly ? 'Weekly Notices' : activeDetailItem.isSpeaking ? 'Speaking Arrangement' : (activeDetailItem.wing === 'Others' ? activeDetailItem.custom_wing : activeDetailItem.wing) || 'Special Programme'}
                  </span>
                  
                  <h2 className={styles.detailTitle}>
                    {activeDetailItem.isWeekly ? `Notice for ${new Date(activeDetailItem.release_date).toLocaleDateString()}` : activeDetailItem.isSpeaking ? (activeDetailItem.title || activeDetailItem.sub_section) : activeDetailItem.title}
                  </h2>
                  
                  <div className={styles.detailInfoGrid}>
                    <div className={styles.detailInfoCard}>
                      <span className={styles.detailInfoLabel}>
                        {activeDetailItem.isSpecial ? 'Event Date/s' : 'Upload Date'}
                      </span>
                      <span className={styles.detailInfoValue}>
                        {activeDetailItem.isWeekly 
                          ? new Date(activeDetailItem.release_date).toLocaleDateString() 
                          : activeDetailItem.isSpeaking
                            ? new Date(activeDetailItem.created_at).toLocaleDateString()
                            : activeDetailItem.event_from 
                              ? new Date(activeDetailItem.event_from).toLocaleDateString() 
                              : new Date(activeDetailItem.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {!activeDetailItem.isWeekly && activeDetailItem.duration && (
                      <div className={styles.detailInfoCard}>
                        <span className={styles.detailInfoLabel}>Duration</span>
                        <span className={styles.detailInfoValue}>{activeDetailItem.duration}</span>
                      </div>
                    )}

                    {!activeDetailItem.isWeekly && activeDetailItem.title && activeDetailItem.title.toLowerCase().includes('aazadi') && (
                      <div className={styles.detailInfoCard} style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem', background: '#fff', border: '1px solid #f0f0f0', marginTop: '0.5rem' }}>
                        <span className={styles.detailInfoLabel} style={{ marginBottom: '0.75rem' }}>Scan and pay registration fee here</span>
                        <img 
                          src="/aazadi_payment_qr.png" 
                          alt="Payment QR Code" 
                          style={{ 
                            border: '3px solid #990000', 
                            borderRadius: '12px', 
                            width: '100%', 
                            maxWidth: '180px',
                            height: 'auto',
                            boxShadow: '0 4px 12px rgba(153,0,0,0.15)'
                          }} 
                        />
                        <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '0.75rem', color: '#444', lineHeight: '1.4', wordBreak: 'break-word', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <span>Send it on whatsapp number with your name:</span>
                          <a href="https://wa.me/917656852269" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: '#25D366', fontWeight: 'bold', fontSize: '1rem', padding: '0.25rem 0.5rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            +91 7656852269
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {activeDetailItem.details && (
                    <div className={styles.detailDescription}>
                      {activeDetailItem.details}
                    </div>
                  )}
                  
                  <div className={styles.detailActions}>
                    {(activeDetailItem.isWeekly ? activeDetailItem.fileUrl : (activeDetailItem.document_path ? getAttachmentUrl(activeDetailItem.document_path) : null)) && (
                      <>
                        <button 
                          onClick={() => {
                            const url = activeDetailItem.isWeekly ? activeDetailItem.fileUrl : getAttachmentUrl(activeDetailItem.document_path);
                            setActivePdfViewer(url);
                          }} 
                          className={styles.detailBtn}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View Document
                        </button>
                        <a 
                          href={activeDetailItem.isWeekly ? activeDetailItem.fileUrl : getAttachmentUrl(activeDetailItem.document_path)} 
                          download
                          className={styles.detailBtnOutline}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Download
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Screen Viewer Modal (Scribd-like for PDF, Lightbox for Images) */}
          {activePdfViewer && (
            <div className={styles.pdfOverlay} onClick={() => setActivePdfViewer(null)}>
              <div className={styles.pdfModal} style={getFileType(activePdfViewer) === 'image' ? { background: 'transparent', boxShadow: 'none' } : {}} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.pdfCloseBtn}
                  onClick={() => setActivePdfViewer(null)}
                  aria-label="Close Viewer"
                  style={getFileType(activePdfViewer) === 'image' ? { background: 'rgba(255,255,255,0.2)', color: '#fff', top: '10px', right: '10px' } : {}}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                {getFileType(activePdfViewer) === 'image' ? (
                  <img 
                    src={activePdfViewer} 
                    alt="Document Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                  />
                ) : (
                  <iframe src={`${activePdfViewer}#toolbar=0`} className={styles.pdfIframe} title="PDF Viewer" />
                )}
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </section>
  )
}