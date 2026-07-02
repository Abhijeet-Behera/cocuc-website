'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import styles from './Preloader.module.css'

let hasPreloaded = false;

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const containerRef = useRef(null)
  const pathname = usePathname()

  // Immediately hide preloader for feedback page
  if (pathname === '/feedback' || pathname === '/feedback/') {
    hasPreloaded = true;
  }

  useEffect(() => {
    if (pathname === '/feedback' || pathname === '/feedback/' || hasPreloaded) {
      setVisible(false)
      return
    }
    hasPreloaded = true

    document.body.style.overflow = 'hidden'
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        setVisible(false)
      }
    })

    // Progress value animation
    tl.to({ val: 0 }, {
      val: 100,
      duration: 3.5,
      ease: "power1.inOut",
      onUpdate: function() {
        setProgress(Math.round(this.targets()[0].val))
      }
    }, 0)

    // Progress bar width animation
    tl.to(`.${styles.progressFill}`, {
      width: '100%',
      duration: 3.5,
      ease: "power1.inOut"
    }, 0)

    // Target yPercent positions to stack them dynamically based on font-size
    // We only push them apart slightly to accommodate the 1.4x scale up
    const targetYPercents = [-40, 0, 40]; 
    const lines = gsap.utils.toArray(`.${styles.line}`);

    // Set initial states: far below the screen, scaled down
    gsap.set(lines, { opacity: 0, scale: 0.8, y: 150 });

    lines.forEach((line, i) => {
      // 1. Pop up from below into natural position
      tl.to(line, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.5)"
      }, i * 0.9 + 0.1);

      // 2. Dislocate (zoomed in, liquid wobble break)
      tl.to(line, {
        yPercent: targetYPercents[i], // Responsive tight stacking
        scaleX: 1.6,
        scaleY: 1.2,
        skewX: 15,       // subtle liquid skew
        duration: 0.2,
        ease: "power2.in"
      }, i * 0.9 + 0.6)
      .to(line, {
        scaleX: 1.4,
        scaleY: 1.4,
        skewX: 0,
        color: '#ff7777', // subtle red type color
        duration: 1.2,
        ease: "elastic.out(1, 0.6)" // smooth water jelly wobble
      }, ">");
    });

    // Out animation for text lines (parallax effect)
    tl.to(`.${styles.line}`, {
      y: "-=50", // move up relative to current dislocated pos
      skewY: -3,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.inOut"
    }, "+=0.5") // Waits 0.5s after everything settles

    // Slide up the entire preloader container
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "power3.inOut"
    }, "<0.1") // Starts almost simultaneously with the text out animation

    return () => {
      document.body.style.overflow = ''
      tl.kill()
    }
  }, [pathname])

  if (pathname === '/feedback' || pathname === '/feedback/') return null;
  if (!visible) return null;

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.lineWrapper}><div className={styles.line} style={{ opacity: 0, transform: 'translateY(150px) scale(0.8)' }}>Worship</div></div>
          <div className={styles.lineWrapper}><div className={styles.line} style={{ opacity: 0, transform: 'translateY(150px) scale(0.8)' }}>Fellowship</div></div>
          <div className={styles.lineWrapper}><div className={styles.line} style={{ opacity: 0, transform: 'translateY(150px) scale(0.8)' }}>Witness</div></div>
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
          <div className={styles.progressText}>{progress}%</div>
        </div>
      </div>
    </div>
  )
}
