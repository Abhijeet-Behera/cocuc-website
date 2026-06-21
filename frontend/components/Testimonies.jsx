'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

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

  // ── Testimony cards stagger animate once loaded ──
  useEffect(() => {
    if (!loading && testimonies.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.testimony-card',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: listColRef.current,
              start: 'top 80%',
              once: true
            }
          }
        )
      }, listColRef)
      return () => ctx.revert()
    }
  }, [loading, testimonies])

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

        {/* ── Left Column: Testimonies List ── */}
        <div ref={listColRef} style={{ display: 'flex', flexDirection: 'column', opacity: 0 }}>

          {/* Creative section label for "Recent Testimonies" */}
          <div ref={listHeadRef} style={{ marginBottom: '1.75rem' }}>
            {/* Decorative rule + serif label combo */}
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
            <p style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#aaa',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0
            }}>God's grace in our congregation</p>
          </div>

          {/* Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            maxHeight: '780px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {loading ? (
              <div className="jumping-dots" style={{ margin: '3rem auto' }}><span></span><span></span><span></span></div>
            ) : testimonies.length === 0 ? (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#aaa',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                border: '1px dashed #e8e8e8',
                borderRadius: '12px',
                background: '#fafafa'
              }}>
                No testimonies published yet.<br />
                <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Be the first to share!</span>
              </div>
            ) : (
              testimonies.map((t, index) => {
                const isExpanded = !!expanded[index]
                const shouldTruncate = t.body && t.body.length > 160
                const displayText = shouldTruncate && !isExpanded ? t.body.substring(0, 160) + '…' : t.body

                return (
                  <div
                    key={index}
                    id={`testimony-${index}`}
                    className="testimony-card"
                    style={{
                      background: '#fff',
                      padding: '1.4rem 1.6rem',
                      borderBottom: '1px solid #f2f2f2',
                      transition: 'background 0.2s ease',
                      cursor: 'default',
                      position: 'relative',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#fdf9f9' }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#fff' }}
                  >
                    {/* Top edge accent on first card */}
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '2px',
                        background: 'var(--color-primary)',
                        opacity: 0.5
                      }} />
                    )}

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.55rem'
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        color: '#bbb',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-heading)'
                      }}>{t.date}</span>
                      {/* Subtle open-quote mark */}
                      <svg width="14" height="11" viewBox="0 0 24 18" fill="var(--color-primary)" style={{ opacity: 0.12 }}>
                        <path d="M0 18V10.8C0 7.488 1.2 4.656 3.6 2.304 6 .096 8.928-.864 12.384.048L11.52 2.64C9.648 2.112 7.92 2.448 6.336 3.648 4.752 4.848 3.96 6.432 3.96 8.4H7.92V18H0zm13.08 0V10.8c0-3.312 1.2-6.144 3.6-8.496C19.08.096 22.008-.864 25.464.048L24.6 2.64c-1.872-.528-3.6-.192-5.184 1.008-1.584 1.2-2.376 2.784-2.376 4.752h3.96V18h-7.92z" />
                      </svg>
                    </div>

                    <h4 style={{
                      fontSize: '1rem',
                      marginBottom: '0.5rem',
                      color: '#1a1a1a',
                      fontWeight: '700',
                      fontFamily: 'var(--font-heading)',
                      lineHeight: '1.3'
                    }}>{t.title}</h4>

                    <p style={{
                      color: 'var(--color-text-muted)',
                      lineHeight: '1.65',
                      fontSize: '0.88rem',
                      margin: 0,
                      fontFamily: 'var(--font-body)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {displayText}
                      {shouldTruncate && (
                        <button
                          onClick={() => {
                            if (isExpanded) {
                              setExpanded(prev => ({ ...prev, [index]: false }));
                              const el = document.getElementById(`testimony-${index}`);
                              if (el) {
                                const y = el.getBoundingClientRect().top + window.scrollY - 100;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            } else {
                              setExpanded(prev => ({ ...prev, [index]: true }));
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            padding: '0 0 0 0.3rem',
                            display: 'inline',
                            fontFamily: 'var(--font-body)'
                          }}
                        >
                          {isExpanded ? ' Show less' : ' Read more'}
                        </button>
                      )}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>

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
