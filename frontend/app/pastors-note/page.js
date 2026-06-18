'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './page.module.css'

// TEMPORARY PASTOR’S NOTE IMAGE DATA
// Replace these files in /public/images/pastors-note/ with the final photographs.
// Recommended image size: 1600px × 900px.
// Required aspect ratio: 16:9.
const CONTENT_SECTIONS = [
  {
    id: 1,
    heading: "Rev. Dr. Ayub Chhinchani",
    designation: "Pastor, Church of Christ Union Church.",
    body: "Welcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journey.Welcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journey",
    image: "/images/pastors-note/aa2.jpg",
    imageAlt: "A welcoming view of our church congregation",
    imagePosition: "left" // Image left, text right
  },
  {
    id: 2,
    heading: "Rev. Songram K. Singh",
    designation: "Pastor, Church of Christ Union Church.",
    body: "As a community, we are called to worship, serve and grow together while reflecting the love of Christ in everything we do. Together, we explore the depths of God's word and find strength in our collective prayers and shared experiences.Welcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journey",
    image: "/images/pastors-note/ss1.jpg",
    imageAlt: "The leadership team and pastor in fellowship",
    imagePosition: "right" // Text left, image right
  },
  {
    id: 3,
    heading: "Rev. Satish Ku. Pani",
    designation: "Pastor, Church of Christ Union Church.",
    body: "May God guide your steps, give you peace in every season and fill your heart with courage, wisdom and grace. We pray that you find comfort in His presence and the strength to overcome any challenges that come your way.Welcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journeyWelcome to our church family. May this message strengthen your faith, renew your hope and encourage you in your walk with Christ. We are committed to nurturing a community where every individual feels valued and supported in their spiritual journey",
    image: "/images/pastors-note/sa3.jpg",
    imageAlt: "A peaceful moment of prayer and reflection",
    imagePosition: "left" // Image left, text right
  }
]

export default function PastorsNotePage() {
  const heroRef = useRef(null)
  const crossRef = useRef(null)
  const timelineRef = useRef(null)
  const lineRef = useRef(null)
  const sectionRefs = useRef([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // ── HERO ANIMATIONS ───────────────────────────────────────
      const heroTl = gsap.timeline()

      // Hero Text Entrance (600-800ms)
      heroTl
        .fromTo(
          `.${styles.eyebrow}`,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          }
        )
        .fromTo(
          `.${styles.title}`,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.6"
        )
        .fromTo(
          `.${styles.subtitle}`,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.6"
        )

      // ── CONTENT REVEAL ANIMATIONS ─────────────────────────────

      // 1. Vertical Line Drawing (1000-1400ms)
      gsap.to(lineRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 80%",
          scrub: true
        }
      })

      // 2. Sequential Row Reveal
      sectionRefs.current.forEach((section) => {
        const image = section.querySelector(`.${styles.imageCol}`)
        const text = section.querySelector(`.${styles.textCol}`)
        const node = section.querySelector(`.${styles.node}`)

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true
          }
        })

        // Animate node
        rowTl.to(node, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)"
        })

        // Animate image and text (Coordination & Stagger)
        const isLeft = section.classList.contains(styles.rowReverse)
          ? false
          : true

        rowTl
          .fromTo(
            image,
            {
              opacity: 0,
              x: isLeft ? -40 : 40
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out"
            },
            "-=0.2"
          )
          .fromTo(
            text,
            {
              opacity: 0,
              x: isLeft ? 40 : -40
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out"
            },
            "-=0.65"
          )
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <section className={styles.hero} ref={heroRef}>
        {/* ANIMATED CROSS AND SMOKE BACKDROP */}
        <div className={styles.animatedBackdrop} aria-hidden="true">
          {/* Permanent ambient background glow */}
          <div className={styles.backgroundGlow} />

          {/* Large smoke layers behind the cross */}
          <div
            className={`${styles.smokeCloud} ${styles.smokeLeftBack}`}
          />

          <div
            className={`${styles.smokeCloud} ${styles.smokeRightBack}`}
          />

          {/* Existing central smoke layers */}
          <div className={styles.smokeLayerOne} />
          <div className={styles.smokeLayerTwo} />
          <div className={styles.smokeLayerThree} />

          {/* Central cross illumination */}
          <div className={styles.crossAura} />

          {/* Existing scalable SVG cross */}
          <svg
            className={styles.crossGraphic}
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            {/* Soft Glow Layer */}
            <path
              className={styles.crossGlow}
              d="M170 50 L230 50 L230 150 L330 150 L330 210 L230 210 L230 450 L170 450 L170 210 L70 210 L70 150 L170 150 Z"
            />

            {/* Main Cross Body */}
            <path
              className={styles.crossBody}
              d="M175 55 L225 55 L225 155 L325 155 L325 205 L225 205 L225 445 L175 445 L175 205 L75 205 L75 155 L175 155 Z"
            />
          </svg>

          {/* Existing red aura */}
          <div className={styles.redAura} />

          {/* Foreground smoke entering from both sides */}
          <div
            className={`${styles.smokeCloud} ${styles.smokeLeftFront}`}
          />

          <div
            className={`${styles.smokeCloud} ${styles.smokeRightFront}`}
          />

          {/* Upper and lower atmospheric mist */}
          <div
            className={`${styles.smokeCloud} ${styles.smokeTop}`}
          />

          <div
            className={`${styles.smokeCloud} ${styles.smokeBottom}`}
          />

          {/* Edge vignette for depth and text readability */}
          <div className={styles.heroVignette} />

          {/* Existing hero shading layer */}
          <div className={styles.heroShade} />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>ABOUT</p>

          <h1 className={styles.title}>Pastor’s Note</h1>

          <p className={styles.subtitle}>
            A message of faith, hope and encouragement from our Pastor.
          </p>
        </div>
      </section>

      {/* EDITORIAL CONTENT SECTION */}
      <section className={styles.editorialSection}>
        <div className={styles.timelineContainer} ref={timelineRef}>
          {/* Vertical Timeline Line */}
          <div className={styles.timeline}>
            <div
              className={styles.timelineProgress}
              ref={lineRef}
            ></div>
          </div>

          {/* Alternating Rows */}
          {CONTENT_SECTIONS.map((section, index) => (
            <div
              key={section.id}
              className={`${styles.row} ${section.imagePosition === 'right'
                ? styles.rowReverse
                : ''
                }`}
              ref={(el) => {
                sectionRefs.current[index] = el
              }}
            >
              <div className={styles.node}></div>

              <div className={styles.imageCol}>
                <div className={styles.imageFrame}>
                  {/*
                    TEMPORARY PASTOR’S NOTE IMAGE
                    Replace this file with the final photograph.
                    Recommended image size: 1600px × 900px.
                    Required aspect ratio: 16:9.
                    Keep the same filename to replace it without editing this component.
                  */}
                  <Image
                    src={section.image}
                    alt={section.imageAlt}
                    width={800}
                    height={450}
                    className={styles.image}
                    priority={index === 0}
                  />
                </div>
              </div>

              <div className={styles.textCol}>
                <div className={styles.headingBlock}>
                  <h2 className={styles.contentHeading}>
                    {section.heading}
                  </h2>

                  {section.designation && (
                    <p className={styles.contentDesignation}>
                      {section.designation}
                    </p>
                  )}
                </div>

                <p className={styles.contentBody}>
                  {section.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER COMMENT
        Pastor’s Note image display:
        Recommended source: 1600 × 900px
        Aspect ratio: 16:9
        Desktop display target: approximately 413 × 238px
        Images use object-fit: cover, so important subjects should remain near the centre.
      */}
    </main>
  )
}