'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './BlogInspiration.module.css'

export default function BlogInspiration() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeBlogModal, setActiveBlogModal] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDraggingState, setIsDraggingState] = useState(false)

  // Refs for tracking position and gestures
  const scrollTarget = useRef(0)
  const scrollProgress = useRef(0)
  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const startX = useRef(0)
  const startScrollProgress = useRef(0)

  // DOM Refs
  const containerRef = useRef(null)
  const sliderRef = useRef(null) // Assigned to viewport
  const trackRef = useRef(null)   // Assigned to track

  // 1. Fetch Blogs Data
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'
        const res = await fetch(`${API_URL}/blogs.php`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setBlogs(data)
        } else {
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

  // 2. Prevent Background Page Scrolling when Modal is Active
  useEffect(() => {
    if (activeBlogModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeBlogModal])

  // 3. 3D Card Style Update Logic
  const updateCardStyles = (progress) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.children
    const N = blogs.length
    if (N === 0 || cards.length !== N) return

    for (let i = 0; i < N; i++) {
      const card = cards[i]
      
      // Calculate wrapped circular offset
      let diff = i - progress
      while (diff < -N / 2) diff += N
      while (diff > N / 2) diff -= N

      const absDiff = Math.abs(diff)
      
      let opacity = 0
      let pointerEvents = 'none'

      // Only display front 3 cards (+ a transition zone to fade out cleanly)
      if (absDiff < 1) {
        opacity = 1 - absDiff * 0.45 // 1.0 in center, 0.55 at neighbors
        pointerEvents = 'auto'
      } else if (absDiff < 1.35) {
        opacity = 0.55 * (1 - (absDiff - 1) / 0.35)
        pointerEvents = 'auto'
      } else {
        opacity = 0
        pointerEvents = 'none'
      }

      // Calculations for circular track positioning
      const scale = 1 - Math.min(absDiff, 1.35) * 0.15
      const spacing = 310 // horizontal pixel offset per card
      const translateX = diff * spacing
      const translateY = absDiff * 16 // dip down slightly at neighbors for circular path
      const translateZ = -absDiff * 180 // push neighbors back
      const rotateY = -diff * 22 // rotate neighbors inward to face center

      card.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`
      card.style.opacity = opacity
      card.style.pointerEvents = pointerEvents
      card.style.zIndex = Math.round((10 - absDiff * 5))

      // Toggle styles for active highlighted card
      if (absDiff < 0.15) {
        card.classList.add(styles.activeCard)
        setActiveIndex(i)
      } else {
        card.classList.remove(styles.activeCard)
      }
    }
  }

  // 4. Smooth Lerp Animation Loop
  useEffect(() => {
    if (loading || blogs.length === 0) return

    let animationFrameId

    const tick = () => {
      const N = blogs.length
      
      // Wrap positions back to [0, N) range to prevent float inaccuracies over time
      if (N > 0 && !isDragging.current) {
        const wrappedProgress = ((scrollProgress.current % N) + N) % N
        const diff = scrollTarget.current - scrollProgress.current
        scrollProgress.current = wrappedProgress
        scrollTarget.current = wrappedProgress + diff
      }

      // Interpolate progress towards target
      const diff = scrollTarget.current - scrollProgress.current
      if (Math.abs(diff) > 0.001) {
        scrollProgress.current += diff * 0.1
      } else {
        scrollProgress.current = scrollTarget.current
      }

      updateCardStyles(scrollProgress.current)
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [loading, blogs])

  // 5. Desktop Drag Handlers & Global Mouse Listeners
  const handleMouseDown = (e) => {
    if (e.button !== 0) return // Left click only
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.clientX
    startScrollProgress.current = scrollTarget.current
    setIsDraggingState(true)
  }

  const handleDragMove = (clientX) => {
    const deltaX = clientX - startX.current
    const deltaProgress = deltaX / 310
    scrollTarget.current = startScrollProgress.current - deltaProgress
    if (Math.abs(deltaX) > 5) {
      hasDragged.current = true
    }
  }

  const handleDragEnd = () => {
    isDragging.current = false
    scrollTarget.current = Math.round(scrollTarget.current)
    setIsDraggingState(false)
  }

  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (!isDragging.current) return
      handleDragMove(e.clientX)
    }

    const handleWindowMouseUp = () => {
      if (isDragging.current) {
        handleDragEnd()
      }
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [])

  // 6. Touch Swipe Event Listeners (Android / iOS)
  useEffect(() => {
    const viewport = sliderRef.current
    if (!viewport) return

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      isDragging.current = true
      hasDragged.current = false
      startX.current = touch.clientX
      startScrollProgress.current = scrollTarget.current
    }

    const handleTouchMove = (e) => {
      if (!isDragging.current) return
      const touch = e.touches[0]
      const deltaX = touch.clientX - startX.current
      const deltaProgress = deltaX / 310
      scrollTarget.current = startScrollProgress.current - deltaProgress
      if (Math.abs(deltaX) > 5) {
        hasDragged.current = true
      }
    }

    const handleTouchEnd = () => {
      if (isDragging.current) {
        handleDragEnd()
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
  }, [blogs])

  // 7. Mouse Wheel & Trackpad Gesture Event Listener
  useEffect(() => {
    const viewport = sliderRef.current
    if (!viewport) return

    let snapTimeout

    const handleWheel = (e) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      const scrollDelta = isHorizontal ? e.deltaX : e.deltaY
      
      // Update target position
      scrollTarget.current += scrollDelta * 0.003
      
      // Prevent browser default gesture back/forward for horizontal swipes
      if (isHorizontal) {
        e.preventDefault()
      }

      // Debounced snapping to nearest whole card
      clearTimeout(snapTimeout)
      snapTimeout = setTimeout(() => {
        scrollTarget.current = Math.round(scrollTarget.current)
      }, 150)
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      viewport.removeEventListener('wheel', handleWheel)
      clearTimeout(snapTimeout)
    }
  }, [blogs])

  // 8. Navigation Buttons Click Handlers
  const handlePrev = () => {
    scrollTarget.current = Math.round(scrollTarget.current - 1)
  }

  const handleNext = () => {
    scrollTarget.current = Math.round(scrollTarget.current + 1)
  }

  // 9. Card Click handler
  const handleCardClick = (e, blog, index) => {
    if (hasDragged.current) {
      e.preventDefault()
      return
    }

    const N = blogs.length
    let diff = index - scrollProgress.current
    while (diff < -N / 2) diff += N
    while (diff > N / 2) diff -= N

    if (Math.abs(diff) < 0.15) {
      setActiveBlogModal(blog)
    } else {
      e.preventDefault()
      scrollTarget.current = Math.round(scrollTarget.current + diff)
    }
  }

  // Close Reading Modal
  const closeModal = () => {
    setActiveBlogModal(null)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="jumping-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    )
  }

  if (!Array.isArray(blogs) || blogs.length === 0) return null

  return (
    <div ref={containerRef} className={styles.sliderSection}>

      {/* Slider Controls Sub-Header */}
      <div className={styles.sliderHeader}>
        <span className={styles.sliderSubtitle}>Scroll, drag, or swipe to explore</span>
        <div className={styles.sliderControls}>
          <button
            className={styles.navButton}
            onClick={handlePrev}
            aria-label="Previous posts"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            className={styles.navButton}
            onClick={handleNext}
            aria-label="Next posts"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Drag Hint */}
      <div className={styles.dragHint} aria-hidden="true">
        <span className={styles.dragHintLine}/>
        <span>drag to explore</span>
        <span className={styles.dragHintLine}/>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={sliderRef}
        className={`${styles.sliderViewport} ${isDraggingState ? styles.dragging : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div ref={trackRef} className={styles.sliderTrack}>
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              id={`blog-${blog.id}`}
              className={styles.article}
              onClick={(e) => handleCardClick(e, blog, index)}
              draggable="false"
            >
              {/* Image Box */}
              <div className={styles.imageContainer} draggable="false">
                {blog.image1_path ? (
                  <img
                    src={blog.image1_path}
                    alt={blog.title}
                    className={styles.image}
                    draggable="false"
                  />
                ) : (
                  <div className={styles.fallbackImage}>
                    <span className={styles.fallbackTitle}>
                      {blog.author_role.toUpperCase() === blog.author_name.toUpperCase()
                        ? blog.author_role
                        : blog.author_role}
                    </span>
                  </div>
                )}
              </div>

              {/* Meta details */}
              <div className={styles.meta} draggable="false">
                <span className={styles.author}>
                  {blog.author_role.toUpperCase() === blog.author_name.toUpperCase()
                    ? blog.author_role
                    : `${blog.author_role} • ${blog.author_name}`}
                </span>
                <span className={styles.date}>
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Title & Short Excerpt */}
              <h3 className={styles.title} draggable="false">{blog.title}</h3>

              <p className={styles.excerpt} draggable="false">
                {blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content}
              </p>

              {/* Card Footer Read Post */}
              <div className={styles.readMoreContainer} draggable="false">
                <span className={styles.readMore}>
                  Read post <span className={styles.arrow}>→</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      {blogs.length > 1 && (
        <div className={styles.dotsRow} aria-hidden="true">
          {blogs.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      )}

      {/* Editorial Reading Modal Overlay */}
      {activeBlogModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close modal">×</button>

            <div className={styles.modalMeta}>
              <span className={styles.author}>
                {activeBlogModal.author_role.toUpperCase() === activeBlogModal.author_name.toUpperCase()
                  ? activeBlogModal.author_role
                  : `${activeBlogModal.author_role} • ${activeBlogModal.author_name}`}
              </span>
              <span className={styles.date}>
                {new Date(activeBlogModal.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className={styles.modalTitle}>{activeBlogModal.title}</h2>

            <div className={styles.modalImages}>
              {activeBlogModal.image1_path && (
                <img src={activeBlogModal.image1_path} alt="Article cover image" className={styles.modalImage} />
              )}
              {activeBlogModal.image2_path && (
                <img src={activeBlogModal.image2_path} alt="Article supporting image" className={styles.modalImage} />
              )}
            </div>

            <div className={styles.modalBody}>
              {activeBlogModal.content}
            </div>

            <div className={styles.modalFooter}>
              {activeBlogModal.pdf_path && (
                <a
                  href={activeBlogModal.pdf_path}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.modalPDF}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                  View PDF Attachment
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
