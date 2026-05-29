'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HeroAnimation({ title, subtitle }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  // Split title into words
  const words = title.split(" ")

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline
      const tl = gsap.timeline()
      
      // Animate words staggered
      tl.from(".word", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "back.out(1.7)"
      })
      
      // Animate subtitle
      tl.from(subtitleRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'var(--color-white)', padding: '0 1rem' }}
    >
      <h1 
        ref={titleRef}
        style={{ 
          fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)', 
          marginBottom: '1.5rem', 
          textShadow: '0 4px 12px rgba(0,0,0,0.3)', 
          letterSpacing: '-1px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        {words.map((word, i) => (
          <span key={i} className="word" style={{ display: 'inline-block' }}>
            {word}
          </span>
        ))}
      </h1>
      <p 
        ref={subtitleRef}
        style={{ 
          fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.25rem)', 
          marginBottom: '1.5rem', 
          maxWidth: '600px', 
          margin: '0 auto', 
          opacity: 0.9,
          lineHeight: '1.6'
        }}
      >
        {subtitle}
      </p>
    </div>
  )
}
