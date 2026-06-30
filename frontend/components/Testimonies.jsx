'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './Testimonies.module.css'

const getPaginationIndices = (active, total) => {
  if (total <= 7) return Array.from({length: total}, (_, i) => i);
  if (active <= 3) return [0, 1, 2, 3, 4, -2, total - 1];
  if (active >= total - 4) return [0, -1, total - 5, total - 4, total - 3, total - 2, total - 1];
  return [0, -1, active - 1, active, active + 1, -2, total - 1];
};

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTestimonyModal, setActiveTestimonyModal] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0) // Start at index 0 (most recent in center)
  const [activePage, setActivePage] = useState(0)
  const [isDraggingState, setIsDraggingState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formTitle, setFormTitle] = useState('')
  const [formBody, setFormBody] = useState('')
  const [consent1, setConsent1] = useState(false)
  const [consent2, setConsent2] = useState(false)

  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [wordCount, setWordCount] = useState(0)

  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const subtitleRef = useRef(null)
  const listColRef = useRef(null)
  const formColRef = useRef(null)
  const listHeadRef = useRef(null)

  // Refs for tracking position and gestures
  const pageTarget = useRef(0)
  const pageProgress = useRef(0)
  const verticalScrollTarget = useRef(0) // Initial focus is index 0 (most recent)
  const verticalScrollProgress = useRef(0)
  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const startScrollProgress = useRef(0)
  const startPageProgress = useRef(0)
  const dragDirection = useRef(null)

  // DOM Refs
  const sliderRef = useRef(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    async function fetchTestimonies() {
      try {
        const res = await fetch(`${API_URL}/testimonials.php`)
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          if (Array.isArray(data)) setTestimonies(data)
          else setTestimonies([])
        } catch (e) {
          console.error("Failed to parse testimonies JSON:", text)
          setTestimonies([])
        }
      } catch (err) {
        console.error("Failed to load testimonies", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonies()
  }, [])

  // ── Section entrance animation ──
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Header title
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true }
        }
      )
      // Subtitle
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: subtitleRef.current, start: 'top 88%', once: true }
        }
      )
      // Left column slide in from left
      gsap.fromTo(listColRef.current,
        { opacity: 0, x: -36 },
        {
          opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: listColRef.current, start: 'top 82%', once: true }
        }
      )
      // Right column slide in from right
      gsap.fromTo(formColRef.current,
        { opacity: 0, x: 36 },
        {
          opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: formColRef.current, start: 'top 82%', once: true }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Prevent Background Page Scrolling when Modal is Active
  useEffect(() => {
    if (activeTestimonyModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeTestimonyModal])

  // Helper to slice testimonies into pages of 5 items (wrapping around)
  const getPages = () => {
    if (!testimonies || testimonies.length === 0) return []
    const N = testimonies.length
    const list = []
    const numPages = Math.ceil(N / 5)
    for (let p = 0; p < numPages; p++) {
      const pageItems = []
      for (let i = 0; i < 5; i++) {
        const index = (p * 5 + i) % N
        pageItems.push({
          ...testimonies[index],
          originalIndex: index
        })
      }
      list.push(pageItems)
    }
    return list
  }

  const pages = getPages()

  // Carousel Layout Parameters for Responsiveness
  const getCarouselParams = () => {
    if (typeof window === 'undefined') {
      return { spacingY: 108, translateZ: 80 }
    }
    const w = window.innerWidth
    if (w < 480) {
      return { spacingY: 82, translateZ: 60 }
    }
    if (w < 768) {
      return { spacingY: 92, translateZ: 70 }
    }
    return { spacingY: 108, translateZ: 80 }
  }

  // Update card coordinates and animations on 3D path
  const updateCarouselStyles = () => {
    const slider = sliderRef.current
    if (!slider) return

    const pageElements = slider.getElementsByClassName(styles.pageTrack)
    const M = pages.length
    if (M === 0 || pageElements.length !== M) return

    const currPageProg = pageProgress.current
    const currVertProg = verticalScrollProgress.current
    const N = 5

    const targetActivePage = ((Math.round(pageTarget.current) % M) + M) % M
    if (activePage !== targetActivePage) {
      setActivePage(targetActivePage)
    }

    const params = getCarouselParams()
    const spacingY = params.spacingY

    for (let p = 0; p < M; p++) {
      const pageEl = pageElements[p]

      // ── Horizontal Page Circular Wrapping ──
      // Compute shortest-path diff using circular wrapping
      let pageDiff = p - currPageProg
      if (M > 1) {
        // Normalize to [-M/2, M/2]
        pageDiff = pageDiff - M * Math.round(pageDiff / M)
      }
      const absPageDiff = Math.abs(pageDiff)

      if (absPageDiff > 1.5) {
        pageEl.style.display = 'none'
        continue
      }

      pageEl.style.display = 'flex'
      const pageTranslateX = pageDiff * 100
      const pageOpacity = Math.max(0, 1 - absPageDiff)
      pageEl.style.transform = `translate3d(${pageTranslateX}%, 0, 0)`
      pageEl.style.opacity = pageOpacity
      pageEl.style.zIndex = Math.round(10 - absPageDiff * 5)

      // ── Vertical Card Circular Loop ──
      const cards = pageEl.getElementsByClassName(styles.article)
      if (cards.length === N) {
        for (let i = 0; i < N; i++) {
          const card = cards[i]

          // Shortest-path circular diff: position i relative to current progress
          let diff = i - currVertProg
          diff = diff - N * Math.round(diff / N)

          const absDiff = Math.abs(diff)

          // Opacity: center=1.0, ±1=0.68, ±2=0.38, beyond fade out
          let cardOpacity, pointerEvents
          if (absDiff <= 2.4) {
            cardOpacity = Math.max(0, 1 - absDiff * 0.31)
            pointerEvents = 'auto'
          } else {
            cardOpacity = 0
            pointerEvents = 'none'
          }

          // Scale: center=1.0, ±1=0.88, ±2=0.76
          const scale = Math.max(0.7, 1 - absDiff * 0.12)
          const translateY = diff * spacingY
          const translateZ = -Math.min(absDiff, 2) * params.translateZ  // depth
          const rotateX = Math.sign(diff) * Math.min(absDiff, 2) * 12  // tilt toward center

          card.style.transform = `translateY(calc(-50% + ${translateY}px)) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`
          card.style.opacity = cardOpacity
          card.style.pointerEvents = pointerEvents
          card.style.zIndex = Math.round(10 - absDiff * 4)

          // Mark active card
          const currentTargetPage = ((Math.round(pageTarget.current) % M) + M) % M
          if (p === currentTargetPage) {
            if (absDiff < 0.15) {
              card.classList.add(styles.activeCard)
              const roundedVert = ((Math.round(verticalScrollTarget.current) % N) + N) % N
              if (activeIndex !== roundedVert) setActiveIndex(roundedVert)
            } else {
              card.classList.remove(styles.activeCard)
            }
          } else {
            card.classList.remove(styles.activeCard)
          }
        }
      }
    }
  }

  // Animation lerp loop
  // ─ Strategy: normalize both progress+target each frame to prevent drift ─
  // This keeps numeric values small while preserving the relative offset,
  // enabling true infinite circular looping without any jump or teleport.
  useEffect(() => {
    if (loading || testimonies.length === 0) return

    let animationFrameId

    const tick = () => {
      const M = Math.ceil(testimonies.length / 5)
      const N = 5

      // ── Page axis: normalize progress→[0,M), shift target by same amount ──
      if (M > 1) {
        if (!isDragging.current) {
          // Keep numeric values from drifting: normalize progress to [0,M), shift target same amount
          const normProg = ((pageProgress.current % M) + M) % M
          const shift = pageProgress.current - normProg
          pageProgress.current = normProg
          pageTarget.current -= shift

          // Find shortest circular path to target, pin target there
          let diff = pageTarget.current - pageProgress.current
          diff = diff - M * Math.round(diff / M)
          pageTarget.current = pageProgress.current + diff
          pageProgress.current += diff * 0.12
        } else {
          // During drag: raw lerp (drag sets target continuously, no wrapping needed)
          pageProgress.current += (pageTarget.current - pageProgress.current) * 0.12
        }
      } else {
        pageProgress.current += (pageTarget.current - pageProgress.current) * 0.12
      }

      // ── Vertical axis: same normalize+lerp pattern ──
      {
        if (!isDragging.current) {
          const normVert = ((verticalScrollProgress.current % N) + N) % N
          const shift = verticalScrollProgress.current - normVert
          verticalScrollProgress.current = normVert
          verticalScrollTarget.current -= shift

          let diff = verticalScrollTarget.current - verticalScrollProgress.current
          diff = diff - N * Math.round(diff / N)
          verticalScrollTarget.current = verticalScrollProgress.current + diff
          verticalScrollProgress.current += diff * 0.12
        } else {
          verticalScrollProgress.current += (verticalScrollTarget.current - verticalScrollProgress.current) * 0.12
        }
      }

      // Check if carousel is actively moving or dragging
      const pageDiff = Math.abs(pageTarget.current - pageProgress.current)
      const vertDiff = Math.abs(verticalScrollTarget.current - verticalScrollProgress.current)
      const isMoving = pageDiff > 0.005 || vertDiff > 0.005 || (isDragging.current && hasDragged.current)

      const slider = sliderRef.current
      if (slider) {
        if (isMoving) {
          slider.classList.add(styles.scrolling)
        } else {
          slider.classList.remove(styles.scrolling)
        }
      }

      updateCarouselStyles()
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [loading, testimonies, activeIndex])

  // Mouse Drag / Swipe Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.clientX
    startY.current = e.clientY
    startScrollProgress.current = verticalScrollTarget.current
    startPageProgress.current = pageTarget.current
    dragDirection.current = null
    setIsDraggingState(true)
  }

  const handleDragMove = (clientX, clientY) => {
    const deltaX = clientX - startX.current
    const deltaY = clientY - startY.current

    if (!dragDirection.current) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        dragDirection.current = 'horizontal'
      } else if (Math.abs(deltaY) >= Math.abs(deltaX) && Math.abs(deltaY) > 20) {
        dragDirection.current = 'vertical'
      }
    }

    if (dragDirection.current === 'horizontal') {
      const viewportWidth = sliderRef.current ? sliderRef.current.clientWidth : 480
      const deltaProgress = deltaX / viewportWidth
      pageTarget.current = startPageProgress.current - deltaProgress * 1.2
      if (Math.abs(deltaX) > 15) hasDragged.current = true
    } else if (dragDirection.current === 'vertical') {
      const params = getCarouselParams()
      const spacingY = params.spacingY
      const deltaProgress = deltaY / spacingY
      verticalScrollTarget.current = startScrollProgress.current - deltaProgress
      if (Math.abs(deltaY) > 15) hasDragged.current = true
    }
  }

  const handleDragEnd = (clientX, clientY) => {
    isDragging.current = false
    pageTarget.current = Math.round(pageTarget.current)
    verticalScrollTarget.current = Math.round(verticalScrollTarget.current)
    setIsDraggingState(false)
    dragDirection.current = null

    if (clientX !== undefined && clientY !== undefined) {
      const deltaX = clientX - startX.current
      const deltaY = clientY - startY.current
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      if (distance < 25) {
        hasDragged.current = false
      }
    } else {
      if (!dragDirection.current) {
        hasDragged.current = false
      }
    }
  }

  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (!isDragging.current) return
      handleDragMove(e.clientX, e.clientY)
    }

    const handleWindowMouseUp = (e) => {
      if (isDragging.current) {
        handleDragEnd(e.clientX, e.clientY)
      }
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [])

  // Android Touch Gestures
  useEffect(() => {
    const viewport = sliderRef.current
    if (!viewport) return

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      isDragging.current = true
      hasDragged.current = false
      startX.current = touch.clientX
      startY.current = touch.clientY
      startScrollProgress.current = verticalScrollTarget.current
      startPageProgress.current = pageTarget.current
      dragDirection.current = null
    }

    const handleTouchMove = (e) => {
      if (!isDragging.current) return
      const touch = e.touches[0]
      handleDragMove(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = (e) => {
      if (isDragging.current) {
        const touch = e.changedTouches ? e.changedTouches[0] : null
        if (touch) {
          handleDragEnd(touch.clientX, touch.clientY)
        } else {
          handleDragEnd()
        }
      }
    }

    viewport.addEventListener('touchstart', handleTouchStart, { passive: true })
    viewport.addEventListener('touchmove', handleTouchMove, { passive: true })
    viewport.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart)
      viewport.removeEventListener('touchmove', handleTouchMove)
      viewport.removeEventListener('touchend', handleTouchEnd)
    }
  }, [testimonies])

  // Mouse Wheel & Trackpad events
  useEffect(() => {
    const viewport = sliderRef.current
    if (!viewport) return

    let snapTimeout

    const handleWheel = (e) => {
      e.preventDefault()

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)

      if (isHorizontal) {
        pageTarget.current += e.deltaX * 0.003
      } else {
        verticalScrollTarget.current += e.deltaY * 0.003
      }

      clearTimeout(snapTimeout)
      snapTimeout = setTimeout(() => {
        pageTarget.current = Math.round(pageTarget.current)
        verticalScrollTarget.current = Math.round(verticalScrollTarget.current)
      }, 150)
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      viewport.removeEventListener('wheel', handleWheel)
      clearTimeout(snapTimeout)
    }
  }, [testimonies])

  // Navigation handlers — relative increments keep the circular loop working correctly
  const handlePrevPage = () => {
    // Snap to nearest integer first, then step back by 1
    pageTarget.current = Math.round(pageTarget.current) - 1
  }

  const handleNextPage = () => {
    pageTarget.current = Math.round(pageTarget.current) + 1
  }

  const handleScrollUp = () => {
    verticalScrollTarget.current = verticalScrollTarget.current - 1
  }

  const handleScrollDown = () => {
    verticalScrollTarget.current = verticalScrollTarget.current + 1
  }

  const handleCardClick = (e, testimony, pageIdx, cardIdx) => {
    if (hasDragged.current) {
      e.preventDefault()
      return
    }

    const M = Math.ceil(testimonies.length / 5)
    const N = 5

    // Find shortest circular path to page
    const activePage = ((Math.round(pageProgress.current) % M) + M) % M
    if (pageIdx !== activePage) {
      let pageDiff = pageIdx - pageProgress.current
      pageDiff = pageDiff - M * Math.round(pageDiff / M)
      pageTarget.current = pageTarget.current + pageDiff
      return
    }

    // Find shortest circular path to card within page
    let diff = cardIdx - verticalScrollProgress.current
    diff = diff - N * Math.round(diff / N)

    if (Math.abs(diff) < 0.48) {
      setActiveTestimonyModal(testimony)
    } else {
      e.preventDefault()
      verticalScrollTarget.current = verticalScrollTarget.current + diff
    }
  }

  const handleBodyChange = (e) => {
    const text = e.target.value
    setFormBody(text)
    const words = text.trim().split(/\s+/)
    setWordCount(text.trim() === '' ? 0 : words.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (wordCount > 500) { setMessage("Your testimony exceeds the 500 word limit."); return }
    if (!consent1 || !consent2) { setMessage("Please agree to both checkboxes to submit."); return }

    setSubmitLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/testimonials.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, body: formBody, consent1, consent2 })
      })

      if (res.ok) {
        setMessage('Testimony submitted successfully! It has been sent to the Pastor.')
        setFormTitle(''); setFormBody(''); setConsent1(false); setConsent2(false); setWordCount(0)
      } else {
        const error = await res.json()
        setMessage(error.error || 'Failed to submit testimony.')
      }
    } catch (err) {
      setMessage('An error occurred while submitting.')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <section className="section container" ref={containerRef} style={{ paddingTop: '2rem' }}>

      {/* ── Section Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <div ref={headerRef} style={{ opacity: 0 }}>
          <h2 className="section-title-elegant">
            <span className="title-normal">Share </span>
            <em className="title-italic">Your Testimony</em>
          </h2>
        </div>
        <p ref={subtitleRef} style={{
          color: 'var(--color-text-muted)',
          maxWidth: '560px',
          margin: '0 auto',
          fontSize: '1.05rem',
          lineHeight: '1.7',
          fontFamily: 'var(--font-body)',
          opacity: 0
        }}>
          Read how God is working in the lives of our church family, and share your own story of faith and deliverance.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem',
        alignItems: 'start'
      }}>

        {/* ── Left Column: Testimonies Carousel ── */}
        <div ref={listColRef} className={styles.sliderSection} style={{ opacity: 0 }}>

          {/* Label header */}
          <div ref={listHeadRef} style={{ marginBottom: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.35rem'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(to right, var(--color-primary), transparent)',
                opacity: 0.35
              }} />
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.45rem',
                fontStyle: 'italic',
                fontWeight: '600',
                color: 'var(--color-primary)',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap'
              }}>
                Recent Testimonies
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(to left, var(--color-primary), transparent)',
                opacity: 0.35
              }} />
            </div>
            
            {/* Header row removed per user request */}
          </div>

          {/* 3D Viewport View */}
          <div
            ref={sliderRef}
            className={styles.sliderViewport}
            onMouseDown={handleMouseDown}
          >
            {loading ? (
              <div className="jumping-dots" style={{ margin: '14rem auto' }}><span></span><span></span><span></span></div>
            ) : pages.length === 0 ? (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#aaa',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                border: '1px dashed #e8e8e8',
                borderRadius: '12px',
                background: '#fafafa',
                margin: '10rem 2rem'
              }}>
                No testimonies published yet.<br />
                <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Be the first to share!</span>
              </div>
            ) : (
              pages.map((pageItems, pageIdx) => (
                <div key={pageIdx} className={styles.pageTrack}>
                  <div className={styles.verticalTrack}>
                    {pageItems.map((t, cardIdx) => {
                      const shouldTruncate = t.body && t.body.length > 130
                      const displayText = shouldTruncate ? t.body.substring(0, 130) + '…' : t.body

                      return (
                        <article
                          key={cardIdx}
                          className={styles.article}
                          onClick={(e) => handleCardClick(e, t, pageIdx, cardIdx)}
                          draggable="false"
                        >
                          <div className={styles.meta} draggable="false">
                            <span className={styles.date}>{t.date}</span>
                            <svg className={styles.quoteIcon} width="14" height="11" viewBox="0 0 24 18" fill="var(--color-primary)">
                              <path d="M0 18V10.8C0 7.488 1.2 4.656 3.6 2.304 6 .096 8.928-.864 12.384.048L11.52 2.64C9.648 2.112 7.92 2.448 6.336 3.648 4.752 4.848 3.96 6.432 3.96 8.4H7.92V18H0zm13.08 0V10.8c0-3.312 1.2-6.144 3.6-8.496C19.08.096 22.008-.864 25.464.048L24.6 2.64c-1.872-.528-3.6-.192-5.184 1.008-1.584 1.2-2.376 2.784-2.376 4.752h3.96V18h-7.92z" />
                            </svg>
                          </div>

                          <h4 className={styles.title} draggable="false">{t.title}</h4>

                          <p className={styles.excerpt} draggable="false">{displayText}</p>

                          <div className={styles.readMoreContainer} draggable="false">
                            <button
                              type="button"
                              className={styles.readMore}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setActiveTestimonyModal(t)
                              }}
                              style={{ 
                                cursor: 'pointer', 
                                background: 'transparent', 
                                border: 'none', 
                                padding: '12px 0 12px 12px',
                                margin: '-12px 0 -12px -12px',
                                outline: 'none'
                              }}
                            >
                              Read full testimony <span style={{ fontFamily: 'sans-serif' }}>→</span>
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Page Number Pagination */}
          {pages.length > 1 && (
            <div className={styles.paginationRow} aria-label="Pagination">
              <button
                className={styles.pageButton}
                onClick={handlePrevPage}
                aria-label="Previous page"
                style={{ border: 'none', background: 'transparent' }}
              >
                &larr;
              </button>

              {getPaginationIndices(activePage, pages.length).map((pageIdx, idx) => {
                if (pageIdx < 0) {
                  return (
                    <span key={`ellipsis-${idx}`} style={{ color: 'var(--color-primary)', opacity: 0.5, display: 'flex', alignItems: 'flex-end', paddingBottom: '0.2rem', justifyContent: 'center', width: '1.2rem' }}>
                      ...
                    </span>
                  )
                }
                const isActive = pageIdx === activePage
                return (
                  <button
                    key={pageIdx}
                    className={`${styles.pageButton} ${isActive ? styles.activePageButton : ''}`}
                    onClick={() => {
                      const M = pages.length
                      let diff = pageIdx - pageProgress.current
                      diff = diff - M * Math.round(diff / M)
                      pageTarget.current = pageProgress.current + diff
                    }}
                    aria-label={`Go to page ${pageIdx + 1}`}
                  >
                    {pageIdx + 1}
                  </button>
                )
              })}

              <button
                className={styles.pageButton}
                onClick={handleNextPage}
                aria-label="Next page"
                style={{ border: 'none', background: 'transparent' }}
              >
                &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Modal Overlay for Full Testimony */}
        {mounted && activeTestimonyModal && createPortal(
          <div className={styles.modalOverlay} onClick={() => setActiveTestimonyModal(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setActiveTestimonyModal(null)} aria-label="Close modal">×</button>
              
              <div className={styles.modalMeta}>
                <span className={styles.date}>{activeTestimonyModal.date}</span>
              </div>
              
              <h2 className={styles.modalTitle}>{activeTestimonyModal.title}</h2>
              
              <div className={styles.modalBody}>
                {activeTestimonyModal.body}
              </div>
            </div>
          </div>,
          document.body
        )}
      {/* ── Right Column: Submit Form ── */}
      <div
        ref={formColRef}
        style={{
          background: '#fff',
          border: '1px solid #efefef',
          borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: '100px',
            opacity: 0
          }}
        >
          {/* Dark header band */}
          <div style={{
            background: 'var(--color-primary)',
            padding: '1.75rem 2.5rem',
          }}>
            <p style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: '700',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-heading)',
              margin: '0 0 0.35rem 0'
            }}>Your Story Matters</p>
            <h3 style={{
              fontSize: '1.55rem',
              color: '#fff',
              fontWeight: '700',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.3px',
              margin: 0,
              lineHeight: '1.2'
            }}>Share a Testimony</h3>
          </div>

          <div style={{ padding: '2rem 2.5rem' }}>
            {message && (
              <div style={{
                padding: '0.85rem 1.1rem',
                marginBottom: '1.5rem',
                backgroundColor: message.includes('success') ? '#f0fdf4' : '#fff5f5',
                color: message.includes('success') ? '#16a34a' : '#dc2626',
                borderRadius: '8px',
                fontSize: '0.9rem',
                border: `1px solid ${message.includes('success') ? '#bbf7d0' : '#fecaca'}`,
                fontFamily: 'var(--font-body)',
                fontWeight: '500'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.45rem',
                  fontWeight: 600,
                  color: '#333',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.02em'
                }}>Title of Testimony</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8',
                    fontSize: '0.95rem',
                    background: '#fafafa',
                    fontFamily: 'var(--font-body)',
                    color: '#1a1a1a',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="e.g., A Journey of Faith"
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(128,0,0,0.07)'; e.target.style.background = '#fff' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#333',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.02em'
                  }}>Body of Testimony</label>
                  <span style={{
                    fontSize: '0.8rem',
                    color: wordCount > 500 ? '#dc2626' : '#aaa',
                    fontWeight: '500',
                    fontFamily: 'var(--font-body)'
                  }}>{wordCount} / 500</span>
                </div>
                <textarea
                  required
                  value={formBody}
                  onChange={handleBodyChange}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8',
                    fontSize: '0.95rem',
                    background: '#fafafa',
                    minHeight: '160px',
                    resize: 'vertical',
                    fontFamily: 'var(--font-body)',
                    color: '#1a1a1a',
                    lineHeight: '1.65',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="Share your experience with God's grace..."
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(128,0,0,0.07)'; e.target.style.background = '#fff' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa' }}
                />
              </div>

              {/* Consent checkboxes */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                background: '#f9f6f6',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid #f0e8e8'
              }}>
                <label style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    required
                    checked={consent1}
                    onChange={(e) => setConsent1(e.target.checked)}
                    style={{ marginTop: '3px', flexShrink: 0, accentColor: '#800000', width: '14px', height: '14px' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#555', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
                    I agree that this testimony is true and real, which I have witnessed in my life, and I believe Jesus as my saviour. <strong style={{ color: '#800000' }}>Proverbs 19:5</strong>: Declares that a false witness will not go unpunished and that anyone who tells lies will not escape.
                  </span>
                </label>

                <label style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    required
                    checked={consent2}
                    onChange={(e) => setConsent2(e.target.checked)}
                    style={{ marginTop: '3px', flexShrink: 0, accentColor: '#800000', width: '14px', height: '14px' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#555', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
                    By clicking this, I give my consent to Church of Christ, Union Church Bhubaneswar to read my testimony and publish it on the website unionchurch.in.
                  </span>
                </label>
              </div>

              {(!formTitle || !formBody || !consent1 || !consent2) && (
                <p style={{
                  fontSize: '0.8rem',
                  color: '#aaa',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                  margin: '-0.25rem 0 0'
                }}>
                  Please fill all fields and agree to the terms to enable submission.
                </p>
              )}

              <button
                type="submit"
                disabled={submitLoading || wordCount > 500 || !formTitle || !formBody || !consent1 || !consent2}
                style={{
                  padding: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  cursor: (submitLoading || wordCount > 500 || !formTitle || !formBody || !consent1 || !consent2) ? 'not-allowed' : 'pointer',
                  opacity: (submitLoading || wordCount > 500 || !formTitle || !formBody || !consent1 || !consent2) ? 0.45 : 1,
                  transition: 'opacity 0.2s, transform 0.2s',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = '0.85' }}
                onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = '1' }}
              >
                {submitLoading ? 'Sending…' : 'Submit Testimony'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
