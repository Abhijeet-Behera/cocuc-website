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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    async function fetchTestimonies() {
      try {
        const res = await fetch(`${API_URL}/testimonials.php`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setTestimonies(data)
        }
      } catch (err) {
        console.error("Failed to load testimonies", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonies()
  }, [])

  useEffect(() => {
    if (!loading && testimonies.length > 0) {
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        gsap.fromTo(`.testimony-card`, 
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true
            }
          }
        )
      }, containerRef)
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
    
    if (wordCount > 500) {
      setMessage("Your testimony exceeds the 500 word limit.")
      return
    }
    if (!consent1 || !consent2) {
      setMessage("Please agree to both checkboxes to submit.")
      return
    }

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
        setFormTitle('')
        setFormBody('')
        setConsent1(false)
        setConsent2(false)
        setWordCount(0)
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
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="section-title-elegant">
          <span className="title-normal">Share </span>
          <em className="title-italic">Your Testimony</em>
        </h2>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Read how God is working in the lives of our church family, and share your own story of faith and deliverance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Submitted Testimonies List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '800px', overflowY: 'auto', paddingRight: '1rem' }} className="custom-scrollbar">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Recent Testimonies</h3>
          {loading ? (
            <div className="jumping-dots" style={{ margin: 'auto' }}><span></span><span></span><span></span></div>
          ) : testimonies.length === 0 ? (
            <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#888' }}>
              No testimonies published yet. Be the first to share!
            </div>
          ) : (
            testimonies.map((t, index) => {
              const isExpanded = !!expanded[index];
              const shouldTruncate = t.body && t.body.length > 150;
              const displayText = shouldTruncate && !isExpanded ? t.body.substring(0, 150) + '...' : t.body;

              return (
              <div key={index} className="testimony-card" style={{ background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--color-primary)', transition: 'transform 0.3s ease', cursor: 'default' }}>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.5px' }}>{t.date}</div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', color: '#111', fontWeight: '700' }}>{t.title}</h4>
                <p style={{ color: '#444', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {displayText}
                  {shouldTruncate && (
                    <button 
                      onClick={() => setExpanded(prev => ({...prev, [index]: !prev[index]}))}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', padding: '0 0 0 0.4rem', display: 'inline', textDecoration: 'underline' }}
                    >
                      {isExpanded ? 'Show less' : 'Read more...'}
                    </button>
                  )}
                </p>
              </div>
            )})
          )}
        </div>

        {/* Submit Testimony Form */}
        <div style={{ background: '#fff', padding: '3rem 2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: '700' }}>Submit your testimony</h3>
          
          {message && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: message.includes('success') ? '#e6ffe6' : '#ffe6e6', color: message.includes('success') ? '#006600' : '#cc0000', borderRadius: '8px', fontSize: '0.95rem' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#444' }}>Title of Testimony</label>
              <input 
                type="text" 
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', fontFamily: 'inherit' }} 
                placeholder="Title (e.g., A Journey of Faith)"
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 600, color: '#444' }}>Body of Testimony</label>
                <span style={{ fontSize: '0.85rem', color: wordCount > 500 ? 'red' : '#888', fontWeight: '500' }}>{wordCount} / 500 words</span>
              </div>
              <textarea 
                required
                value={formBody}
                onChange={handleBodyChange}
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', minHeight: '180px', resize: 'vertical', fontFamily: 'inherit' }} 
                placeholder="Share your experience with God's grace..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f5f5f5', padding: '1.5rem', borderRadius: '12px' }}>
              <label style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required checked={consent1} onChange={(e) => setConsent1(e.target.checked)} style={{ marginTop: '5px', transform: 'scale(1.2)', accentColor: '#800000' }} />
                <span style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>
                  I agree that this testimony is true and real, which I have witnessed in my life, and I believe God as my saviour. <strong>Proverbs 19:5</strong>: Declares that a false witness will not go unpunished and that anyone who tells lies will not escape.
                </span>
              </label>

              <label style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required checked={consent2} onChange={(e) => setConsent2(e.target.checked)} style={{ marginTop: '5px', transform: 'scale(1.2)', accentColor: '#800000' }} />
                <span style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>
                  By clicking this, I give my consent to Church of Christ, Union Church Bhubaneswar to read my testimony and publish it on the website unionchurch.in.
                </span>
              </label>
            </div>

            {(!formTitle || !formBody || !consent1 || !consent2) && (
              <div style={{ fontSize: '0.85rem', color: '#cc0000', textAlign: 'center', marginTop: '-0.5rem' }}>
                Please fill all fields and agree to the terms to enable submission.
              </div>
            )}
            <button 
              type="submit" 
              disabled={submitLoading || wordCount > 500 || !formTitle || !formBody || !consent1 || !consent2} 
              className="btn-primary" 
              style={{ 
                padding: '1.2rem', 
                fontSize: '1.05rem', 
                fontWeight: '600', 
                borderRadius: '12px', 
                border: 'none', 
                cursor: (submitLoading || wordCount > 500 || !formTitle || !formBody || !consent1 || !consent2) ? 'not-allowed' : 'pointer', 
                opacity: (submitLoading || wordCount > 500 || !formTitle || !formBody || !consent1 || !consent2) ? 0.4 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              {submitLoading ? 'Sending...' : 'Submit Testimony'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
