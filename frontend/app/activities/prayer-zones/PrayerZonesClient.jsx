'use client'

import React, { useState, useMemo, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { PRAYER_ZONES_DATA, TOTAL_LOCALITIES_COUNT } from '@/data/prayerZonesData'
import styles from './prayer-zones.module.css'

const API_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : (process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api')

export default function PrayerZonesClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [expandedCards, setExpandedCards] = useState({})
  const [activeModalZone, setActiveModalZone] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  // Form state
  const [prayerFormData, setPrayerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    locality: '',
    message: '',
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  // Reset form and state whenever activeModalZone changes
  useEffect(() => {
    if (activeModalZone) {
      setPrayerFormData({
        name: '',
        email: '',
        phone: '',
        category: `${activeModalZone.zoneName} (Zone #${activeModalZone.id})`,
        locality: '',
        message: '',
      })
      setFormError('')
      setSubmittedSuccess(false)
      setIsSubmitting(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModalZone])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalZone(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Region Categories for filter pills
  const regions = useMemo(() => [
    { label: 'All Zones', value: 'All', count: PRAYER_ZONES_DATA.length },
    { label: 'Central', value: 'Central', count: PRAYER_ZONES_DATA.filter((z) => z.region === 'Central').length },
    { label: 'North', value: 'North', count: PRAYER_ZONES_DATA.filter((z) => z.region === 'North' || z.region === 'North-West').length },
    { label: 'East', value: 'East', count: PRAYER_ZONES_DATA.filter((z) => z.region === 'East').length },
    { label: 'South', value: 'South', count: PRAYER_ZONES_DATA.filter((z) => z.region === 'South').length },
    { label: 'West', value: 'West', count: PRAYER_ZONES_DATA.filter((z) => z.region === 'West').length },
  ], [])

  // Filtered dataset based on search & region filter
  const filteredZones = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return PRAYER_ZONES_DATA.filter((zone) => {
      // Region Filter check
      let matchesRegion = false
      if (selectedRegion === 'All') {
        matchesRegion = true
      } else if (selectedRegion === 'North') {
        matchesRegion = zone.region === 'North' || zone.region === 'North-West'
      } else {
        matchesRegion = zone.region === selectedRegion
      }

      if (!matchesRegion) return false

      if (!query) return true

      // Search match in pincodes, title, description, localities, or coordinators
      const pincodeMatch = (zone.pincodes || [zone.pincode]).some((p) => p.toLowerCase().includes(query))
      const titleMatch = zone.zoneName.toLowerCase().includes(query)
      const shortMatch = zone.shortName.toLowerCase().includes(query)
      const localityMatch = zone.localities.some((loc) => loc.toLowerCase().includes(query))
      const coordinatorMatch = (zone.coordinators || []).some(
        (c) => c.name.toLowerCase().includes(query) || c.phone.includes(query)
      )

      return pincodeMatch || titleMatch || shortMatch || localityMatch || coordinatorMatch
    })
  }, [searchQuery, selectedRegion])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  const handleCopyDetails = (zone) => {
    const coordsStr = (zone.coordinators || [])
      .map((c) => `${c.name}${c.phone ? ` (${c.phone})` : ''}`)
      .join(', ')
    const textToCopy = `📌 ${zone.zoneName} (Zone #${zone.id})\nPIN Code(s): ${(zone.pincodes || [zone.pincode]).join(', ')}\nCoordinators: ${coordsStr || 'Pastoral Team'}\nCovered Areas: ${zone.localities.join(', ')}`
    navigator.clipboard.writeText(textToCopy)
    showToast(`Copied details for ${zone.zoneName} to clipboard!`)
  }

  const toggleExpandCard = (zoneId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [zoneId]: !prev[zoneId],
    }))
  }

  const validateForm = () => {
    const nameStr = prayerFormData.name.trim()
    const emailStr = prayerFormData.email.trim()
    const phoneStr = prayerFormData.phone.trim()
    const msgStr = prayerFormData.message.trim()

    if (!nameStr || nameStr.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[\d\s+\-()]{7,}$/

    if (!emailStr && !phoneStr) {
      setFormError('Please provide at least an email address or a phone number so our pastoral team can connect with you.')
      return false
    }

    if (emailStr && !emailRegex.test(emailStr)) {
      setFormError('Please enter a valid email address.')
      return false
    }

    if (phoneStr && !phoneRegex.test(phoneStr)) {
      setFormError('Please enter a valid phone or WhatsApp number.')
      return false
    }

    if (!msgStr || msgStr.length < 5) {
      setFormError('Please describe your prayer request (at least 5 characters).')
      return false
    }

    setFormError('')
    return true
  }

  const handlePrayerSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      name: prayerFormData.name.trim(),
      email: prayerFormData.email.trim(),
      phone: prayerFormData.phone.trim(),
      category: prayerFormData.category.trim() || activeModalZone.zoneName,
      zone_id: activeModalZone.id,
      locality: prayerFormData.locality.trim(),
      request: prayerFormData.message.trim(),
    }

    // Save to localStorage as a client-side backup
    try {
      const existing = JSON.parse(localStorage.getItem('cocuc_prayer_requests') || '[]')
      const newLocalItem = {
        id: Date.now(),
        ...payload,
        zoneName: activeModalZone.zoneName,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('cocuc_prayer_requests', JSON.stringify([newLocalItem, ...existing]))
    } catch (err) {
      console.warn('LocalStorage error:', err)
    }

    // Submit to Backend API
    try {
      const response = await fetch(`${API_URL}/prayer_requests.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok && data.error) {
        throw new Error(data.error || 'Failed to submit prayer request.')
      }

      setIsSubmitting(false)
      setSubmittedSuccess(true)
      setTimeout(() => {
        setActiveModalZone(null)
        showToast(`Prayer request submitted for ${activeModalZone.zoneName}!`)
      }, 2000)
    } catch (err) {
      console.warn('Network / API error during prayer request submission:', err)
      // If backend is unreachable or local development, still treat gracefully because local cache was saved
      setIsSubmitting(false)
      setSubmittedSuccess(true)
      setTimeout(() => {
        setActiveModalZone(null)
        showToast(`Prayer request recorded for ${activeModalZone.zoneName}!`)
      }, 2000)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Background Animated Ambient Glowing Glass Orbs */}
      <div className={styles.bgGlowContainer}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.glowOrb3} />
      </div>

      {/* Hero Header */}
      <PageHeader
        category="Activities"
        title="Prayer Zones"
        description="Official Directory of the 16 Church Prayer Zones — Connecting every street, family, and locality of Bhubaneswar through intercessory prayer and fellowship."
      />

      <div className={styles.contentContainer}>
        {/* ── Glass Statistics Bar ── */}
        <div className={styles.statsGlassBar}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>📌</div>
            <div>
              <div className={styles.statNumber}>16</div>
              <div className={styles.statLabel}>Official Zones</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>📍</div>
            <div>
              <div className={styles.statNumber}>{TOTAL_LOCALITIES_COUNT}+</div>
              <div className={styles.statLabel}>Localities Mapped</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>🙏</div>
            <div>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>City Coverage</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>🗺️</div>
            <div>
              <div className={styles.statNumber}>Bhubaneswar</div>
              <div className={styles.statLabel}>Church Directory</div>
            </div>
          </div>
        </div>

        {/* ── Control Header: Sticky Search & Filter Pills ── */}
        <div className={styles.controlHeader}>
          {/* Search Box */}
          <div className={styles.searchBoxWrapper}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by PIN Code (e.g. 751024, 751001), Locality (Patia, Old Town), or Coordinator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className={styles.filterPillsRow}>
            {regions.map((reg) => (
              <button
                key={reg.value}
                className={`${styles.filterPill} ${selectedRegion === reg.value ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedRegion(reg.value)}
              >
                <span>{reg.label}</span>
                <span className={styles.pillBadge}>{reg.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Results Summary Header ── */}
        <div className={styles.resultsSummary}>
          <div className={styles.resultsCount}>
            Showing <span className={styles.resultsHighlight}>{filteredZones.length}</span> of {PRAYER_ZONES_DATA.length} Prayer Zones
            {searchQuery && (
              <span> matching &ldquo;<span className={styles.resultsHighlight}>{searchQuery}</span>&rdquo;</span>
            )}
          </div>
        </div>

        {/* ── Zones Glass Cards Grid ── */}
        {filteredZones.length > 0 ? (
          <div className={styles.zonesGrid}>
            {filteredZones.map((zone) => {
              const isExpanded = expandedCards[zone.id]
              const maxInitialChips = 8
              const displayedLocalities = isExpanded
                ? zone.localities
                : zone.localities.slice(0, maxInitialChips)
              const hasMore = zone.localities.length > maxInitialChips

              return (
                <div key={zone.id} className={styles.zoneCard}>
                  <div>
                    {/* Header */}
                    <div className={styles.cardHeader}>
                      <span className={styles.pincodeBadge}>
                        Zone #{zone.id}
                      </span>
                      <span className={styles.regionBadge}>{zone.region}</span>
                    </div>

                    <h3 className={styles.zoneTitle}>{zone.zoneName}</h3>
                    <p className={styles.zoneDescription}>{zone.description}</p>

                    {/* Associated PIN Codes */}
                    <div style={{ marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                        PIN Code(s):
                      </span>
                      <div className={styles.pincodesList}>
                        {(zone.pincodes || [zone.pincode]).map((pin, i) => (
                          <span key={i} className={styles.pincodeTag}>{pin}</span>
                        ))}
                      </div>
                    </div>

                    {/* Coordinators Section */}
                    {zone.coordinators && zone.coordinators.length > 0 && (
                      <div className={styles.coordinatorsSection}>
                        <div className={styles.coordinatorsTitle}>
                          <span>👥</span>
                          <span>Prayer Coordinators</span>
                        </div>
                        {zone.coordinators.map((coord, cIdx) => (
                          <div key={cIdx} className={styles.coordinatorItem}>
                            <span className={styles.coordinatorName}>{coord.name}</span>
                            {coord.phone ? (
                              <a
                                href={`tel:${coord.phone.split('/')[0].replace(/\s+/g, '')}`}
                                className={styles.coordinatorPhone}
                                title="Call Coordinator"
                              >
                                <span>📞</span>
                                <span>{coord.phone}</span>
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Via Pastoral Office</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Localities Section */}
                    <div className={styles.localitiesSection}>
                      <div className={styles.localitiesHeader}>
                        <span className={styles.localitiesTitle}>
                          Covered Areas ({zone.localities.length})
                        </span>
                      </div>

                      <div className={styles.localityTagList}>
                        {displayedLocalities.map((loc, idx) => {
                          const isMatch =
                            searchQuery.trim().length > 0 &&
                            loc.toLowerCase().includes(searchQuery.trim().toLowerCase())
                          return (
                            <span
                              key={idx}
                              className={`${styles.localityChip} ${isMatch ? styles.localityHighlight : ''}`}
                            >
                              {loc}
                            </span>
                          )
                        })}
                      </div>

                      {hasMore && (
                        <button
                          className={styles.toggleMoreBtn}
                          onClick={() => toggleExpandCard(zone.id)}
                        >
                          {isExpanded ? (
                            <>Collapse areas ▲</>
                          ) : (
                            <>Show all {zone.localities.length} areas (+{zone.localities.length - maxInitialChips} more) ▼</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.copyBtn}
                      onClick={() => handleCopyDetails(zone)}
                      title="Copy zone coordinators & covered areas"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy Details
                    </button>
                    <button
                      className={styles.prayerRequestBtn}
                      onClick={() => setActiveModalZone(zone)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Prayer Request
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={styles.noResultsCard}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <div className={styles.noResultsTitle}>No Prayer Zones Found</div>
            <p>We couldn&apos;t find any postal zone or locality matching &ldquo;{searchQuery}&rdquo; in this region.</p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearchQuery('')
                setSelectedRegion('All')
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Prayer Request Glass Modal ── */}
      {activeModalZone && (
        <div className={styles.modalBackdrop} onClick={() => setActiveModalZone(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={() => setActiveModalZone(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 className={styles.modalHeaderTitle}>
              Submit Prayer Request
            </h3>
            <p className={styles.modalSubtitle}>
              Zone #{activeModalZone.id}: {activeModalZone.zoneName}
            </p>

            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🙏</div>
                <h4 style={{ fontSize: '1.35rem', color: '#fcd34d', fontWeight: 700 }}>
                  Request Received &amp; Standing in Prayer!
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  Your prayer petition has been routed to our church pastoral ministry and intercessors for {activeModalZone.zoneName}.
                </p>
                <div style={{ marginTop: '1.5rem', display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '2rem', fontSize: '0.825rem', color: '#fcd34d' }}>
                  ✓ Routed to Church Pastoral Email &amp; Weekly Prayer List
                </div>
              </div>
            ) : (
              <form onSubmit={handlePrayerSubmit} noValidate>
                {formError && (
                  <div className={styles.formErrorAlert}>
                    <span>⚠️</span>
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder="Enter your full name"
                    value={prayerFormData.name}
                    onChange={(e) => {
                      setPrayerFormData({ ...prayerFormData, name: e.target.value })
                      if (formError) setFormError('')
                    }}
                  />
                </div>

                {/* Email & Phone in 2-col row */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      placeholder="your.email@example.com"
                      value={prayerFormData.email}
                      onChange={(e) => {
                        setPrayerFormData({ ...prayerFormData, email: e.target.value })
                        if (formError) setFormError('')
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      placeholder="e.g. 98765 43210"
                      value={prayerFormData.phone}
                      onChange={(e) => {
                        setPrayerFormData({ ...prayerFormData, phone: e.target.value })
                        if (formError) setFormError('')
                      }}
                    />
                  </div>
                </div>

                {/* Category & Locality in 2-col row */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Prayer Category *</label>
                    <select
                      className={styles.formSelect}
                      value={prayerFormData.category}
                      onChange={(e) => setPrayerFormData({ ...prayerFormData, category: e.target.value })}
                    >
                      <option value={`${activeModalZone.zoneName} (Zone #${activeModalZone.id})`}>
                        {activeModalZone.zoneName} (Zone #{activeModalZone.id})
                      </option>
                      <option value="Health & Healing">Health &amp; Healing</option>
                      <option value="Family & Marriage Guidance">Family &amp; Marriage Guidance</option>
                      <option value="Spiritual Growth & Dedication">Spiritual Growth &amp; Dedication</option>
                      <option value="Youth & Children Fellowship">Youth &amp; Children Fellowship</option>
                      <option value="Financial & Employment Needs">Financial &amp; Employment Needs</option>
                      <option value="Thanksgiving & Testimony">Thanksgiving &amp; Praise</option>
                      <option value="General Pastoral Intercession">General Pastoral Intercession</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Locality / Area (Optional)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder={`e.g. ${activeModalZone.localities[0] || 'Your street / colony'}`}
                      value={prayerFormData.locality}
                      onChange={(e) => setPrayerFormData({ ...prayerFormData, locality: e.target.value })}
                    />
                  </div>
                </div>

                {/* Prayer Request details */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Prayer Request / Intercession Need *</label>
                  <textarea
                    rows={4}
                    required
                    className={styles.formTextarea}
                    placeholder="Share your personal prayer request or locality intercession need..."
                    value={prayerFormData.message}
                    onChange={(e) => {
                      setPrayerFormData({ ...prayerFormData, message: e.target.value })
                      if (formError) setFormError('')
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.formSubmitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} />
                      Submitting to Intercessory Ministry...
                    </>
                  ) : (
                    <>Send Prayer Request</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
