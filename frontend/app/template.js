'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Template({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 25, scale: 0.99 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          ease: "power2.out" 
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {children}
    </div>
  )
}

