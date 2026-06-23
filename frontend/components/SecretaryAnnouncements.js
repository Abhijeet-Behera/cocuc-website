'use client'

import { useState, useEffect } from 'react'

export default function SecretaryAnnouncements() {
  const [weeklyNotices, setWeeklyNotices] = useState([])
  const [specialProgrammes, setSpecialProgrammes] = useState([])
  const [speakingArrangements, setSpeakingArrangements] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/weekly_notices.php`).then(res => res.json()),
      fetch(`${API_URL}/special_programmes.php`).then(res => res.json()),
      fetch(`${API_URL}/speaking_arrangements.php`).then(res => res.json())
    ])
    .then(([weekly, special, speaking]) => {
      if(Array.isArray(weekly)) setWeeklyNotices(weekly)
      if(Array.isArray(special)) setSpecialProgrammes(special)
      if(Array.isArray(speaking)) setSpeakingArrangements(speaking)
      setLoading(false)
    })
    .catch(err => {
      console.error("Failed to load secretary announcements", err)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading Latest Announcements...</p>
      </div>
    )
  }

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid #eaeaea',
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }

  const titleStyle = {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '0.8rem',
    marginBottom: '0.5rem'
  }

  const itemStyle = {
    padding: '1rem',
    background: '#fafafa',
    borderRadius: '8px',
    borderLeft: '4px solid var(--color-primary)'
  }

  return (
    <section className="section container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '2.5rem', color: '#111' }}>Church Updates</h2>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
        
        {/* Weekly Notices Proxy Card */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Weekly Notices</h3>
          {weeklyNotices.length > 0 ? weeklyNotices.slice(0, 3).map(item => (
            <div key={item.id} style={itemStyle}>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Notice</strong>
              <small style={{ color: '#666' }}>Released: {new Date(item.release_date).toLocaleDateString()}</small>
              <br/>
              <small style={{ color: 'var(--color-primary)' }}>{item.documents_json ? JSON.parse(item.documents_json).length : 0} Document(s) attached</small>
            </div>
          )) : <p style={{ color: '#888' }}>No recent notices.</p>}
        </div>

        {/* Special Programmes Proxy Card */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Special Programmes</h3>
          {specialProgrammes.length > 0 ? specialProgrammes.slice(0, 3).map(item => (
            <div key={item.id} style={itemStyle}>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{item.title}</strong>
              <small style={{ color: '#666' }}>{item.wing === 'Others' ? item.custom_wing : item.wing}</small>
              <br/>
              <small style={{ color: 'var(--color-primary)' }}>Date: {new Date(item.upload_date).toLocaleDateString()}</small>
            </div>
          )) : <p style={{ color: '#888' }}>No recent programmes.</p>}
        </div>

        {/* Speaking Arrangements Proxy Card */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Speaking Arrangements</h3>
          {speakingArrangements.length > 0 ? speakingArrangements.slice(0, 3).map(item => (
            <div key={item.id} style={itemStyle}>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{item.sub_section}</strong>
              <small style={{ color: '#666' }}>Event Date: {new Date(item.event_date).toLocaleDateString()}</small>
            </div>
          )) : <p style={{ color: '#888' }}>No recent arrangements.</p>}
        </div>

      </div>
    </section>
  )
}
