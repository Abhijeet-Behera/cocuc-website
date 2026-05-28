'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

export default function Reveal({ children, width = '100%', delay = 0.15 }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%", // Trigger when top of element hits 85% from top of viewport
            once: true
          }
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [delay])

  return (
    <div style={{ position: 'relative', width }}>
      <div ref={ref} style={{ opacity: 0 }}>
        {children}
      </div>
    </div>
  )
}
