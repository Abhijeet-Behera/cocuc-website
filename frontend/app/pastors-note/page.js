'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import PageHeader from '@/components/PageHeader'

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
    body: [
      "We greet you and welcome you to our new website with a brand new look and new features. It is quite encouraging and overwhelming that many lives are being touched and transformed through online sermons. This gives us a great sense of satisfaction and fulfillment in the Lord and propels us to toil even harder and stronger for the cause of Christ.",
      "I extend my heartfelt gratitude to all of you for taking time to visit our website. Our new website is created with much prayer and serious purpose and is geared towards catering to the needs of our believers and people at large — featuring updates on all the church activities and special programmes beginning from Sunday worship to Bible study, baptism, prayer meetings, women's fellowship, youth fellowship, Sunday school, and Christian Endeavour.",
      "We, as the body of Christ, envision accomplishing the three-fold purposes of the local Church — Worship, Fellowship, and Witnessing — in and around our city and beyond. Church of Christ is composed of individuals and families who have discovered meaning and purpose for living through a personal relationship with Jesus as Savior and Lord.",
      "We strive to proclaim the Good News of Jesus Christ to the community and the world, equip members by teaching the Word of God in its authority and entirety with accurate interpretation — depending on the guidance of the Holy Spirit — to be rooted and grounded in the Word of God for the ministry, encourage and promote Christ-like maturity, love and fellowship in order to glorify God in all aspects of life.",
      "Any time you are in the city looking for a church to worship and fellowship, look no further — just drop by our church which is closest to the railway station and airport. We welcome people from all walks of life and all backgrounds. It will be an honour to meet and know you and your family when you visit us. Soli Deo Gloria! (Glory to God). May God Bless you richly!",
    ],
    image: "/images/pastors-note/aa2.jpg",
    imageAlt: "Rev. Dr. Ayub Chhinchani — Pastor, Church of Christ Union Church",
    imagePosition: "left"
  },
  {
    id: 2,
    heading: "Rev. Songram K. Singh",
    designation: "Pastor, Church of Christ Union Church.",
    body: [
      "A Warm Welcome to Our Church Family. Welcome home. Whether you are clicking through our website for the first time or you have been part of this community for years, I am so glad you are here.",
      "At its heart, our church is not just a building or a Sunday service — it is a community of people learning what it means to love God and love our neighbours well. We are a diverse group of imperfect people, all gathering around the message of hope, grace, and redemption found in Jesus. We believe that no matter where you are on your spiritual journey — whether you are just beginning to ask questions or you have walked with God for a lifetime — you have a vital place in our church family.",
      "Life can often feel overwhelming, busy, and isolating. My deepest prayer is that when you walk through our doors, you find a space where you can breathe, be yourself, and experience the warmth of true community. We are committed to being a church that points toward hope in a world that often feels divided.",
      "We invite you to join us this Sunday. Come as you are, bring your questions, and find a place to connect. You don't have to navigate life alone; we would love to walk this path with you.",
      "If there is ever any way our team can serve you, pray for you, or help you get connected to a small group, please do not hesitate to reach out. We are honoured that you are considering us as your church family. Grace and peace.",
    ],
    image: "/images/pastors-note/ss1.jpg",
    imageAlt: "Rev. Songram K. Singh — Pastor, Church of Christ Union Church",
    imagePosition: "right"
  },
  {
    id: 3,
    heading: "Rev. Satish Ku. Pani",
    designation: "Pastor, Church of Christ Union Church.",
    body: [
      "Welcome to Our Church Family. We are delighted to welcome you to our website. Whether you are seeking a place to worship, looking for spiritual guidance, exploring the faith in Christ, or simply visiting — we are grateful that you are here.",
      "\"Church of Christ Union Church\" is a community built on faith, hope, and love, centred on biblical teachings. We believe that every person is valued by God and has a unique purpose in God's plan. No matter where you are on your spiritual journey, you will find a warm and caring family ready to walk alongside you.",
      "As the body of Christ, Jesus is the head of this Church and we are focused on the three-fold purposes — Worship, Fellowship, and Witness. We believe and practice worship by praising and honouring God in truth and spirit. We strongly believe in fellowship as the Bible emphasises it as an essential part of Christian life, promoting unity, love, and mutual care (Acts 2:42). We witness of Christ Jesus through our words and actions that He is the Son of God, the Saviour of the world (Acts 1:8).",
      "It is greatly encouraging to know that our website has been visited by people from near about 35 different countries, and every sermon posted on YouTube has been heard by many. Many lives are being touched and transformed — and this gives us a great sense of satisfaction and fulfilment in the Lord.",
      "\"Come to me, all you who are weary and burdened, and I will give you rest.\" — Matthew 11:28. May God's peace, grace, and blessings be with you today and always. We look forward to welcoming you in person and sharing the journey of faith together.",
    ],
    image: "/images/pastors-note/sa3.jpg",
    imageAlt: "Rev. Satish Ku. Pani — Pastor, Church of Christ Union Church",
    imagePosition: "left"
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
    }, timelineRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className={styles.main}>
      {/* HERO SECTION */}
      <PageHeader
        category="About"
        title="Pastor’s Note"
        description="A message of faith, hope and encouragement from our Pastor."
      />

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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(Array.isArray(section.body) ? section.body : [section.body]).map((para, pIdx) => (
                    <p key={pIdx} className={styles.contentBody}>
                      {para}
                    </p>
                  ))}
                </div>
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