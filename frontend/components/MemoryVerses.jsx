'use client'

import { useState, useEffect } from 'react'
import styles from './MemoryVerses.module.css'

function TiltCard({ children, className }) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Increased degrees for a significant tilt
    const rotateX = ((y - centerY) / centerY) * -15 
    const rotateY = ((x - centerX) / centerX) * 15
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setIsHovered(false)
  }

  return (
    <div 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform, 
        transition: isHovered ? 'transform 0.1s ease-out, background 0.3s ease, border-color 0.3s ease' : 'transform 0.5s ease-out, background 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  )
}

export default function MemoryVerses() {
  const [verses, setVerses] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVerses() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
        const spreadsheetId = process.env.NEXT_PUBLIC_MEMORY_VERSE_SPREADSHEET_ID;

        if (!apiKey || !spreadsheetId) {
          throw new Error("Missing Google Sheets API keys");
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Verses!A2:E?key=${apiKey}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to fetch from Google");

        const data = await res.json();
        const rows = data.values || [];

        // Today's date in IST for comparison (format: YYYY-MM-DD)
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const istDate = new Date(utcMs + 330 * 60000);
        const todayStr = istDate.toISOString().split('T')[0];

        let daily = null;
        let weekly = null;
        let monthly = null;

        // Filter rows before or equal to today, sort newest first
        const pastOrTodayRows = rows
          .filter(row => row[1] && row[1] <= todayStr)
          .sort((a, b) => new Date(b[1]) - new Date(a[1])); 

        for (const row of pastOrTodayRows) {
          const type = (row[2] || "").toLowerCase();
          const verseObj = {
            date: row[1],
            type: row[2],
            reference: row[3],
            scripture: row[4]
          };

          if (type === 'daily' && !daily) daily = verseObj;
          if (type === 'weekly' && !weekly) weekly = verseObj;
          if (type === 'monthly' && !monthly) monthly = verseObj;

          if (daily && weekly && monthly) break;
        }

        setVerses({
          daily: daily || { type: "Daily", reference: "Psalm 118:24", scripture: "This is the day that the LORD has made; let us rejoice and be glad in it." },
          weekly: weekly || { type: "Weekly", reference: "Proverbs 3:5-6", scripture: "Trust in the LORD with all your heart, and do not lean on your own understanding." },
          monthly: monthly || { type: "Monthly", reference: "Joshua 1:9", scripture: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go." }
        });

      } catch (error) {
        console.error('Failed to fetch memory verses:', error);
      } finally {
        setLoading(false)
      }
    }

    fetchVerses()
  }, [])

  if (loading) {
    return (
      <div className={styles.memoryVersesWrapper}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    )
  }

  // Fallback gracefully if no verses found or an error occurred
  if (!verses || verses.error) {
    return null; // Return nothing rather than breaking the UI
  }

  return (
    <div className={styles.memoryVersesWrapper}>
      <div className={styles.versesGrid}>
        
        {/* Daily Verse */}
        {verses.daily && (
          <TiltCard className={styles.verseCard}>
            <div className={styles.verseHeader}>
              <span className={styles.verseType}>Verse of the Day</span>
              <span className={styles.verseReference}>{verses.daily.reference}</span>
            </div>
            <p className={styles.verseScripture}>"{verses.daily.scripture}"</p>
          </TiltCard>
        )}

        {/* Weekly Verse */}
        {verses.weekly && (
          <TiltCard className={styles.verseCard}>
            <div className={styles.verseHeader}>
              <span className={styles.verseType}>Verse of the Week</span>
              <span className={styles.verseReference}>{verses.weekly.reference}</span>
            </div>
            <p className={styles.verseScripture}>"{verses.weekly.scripture}"</p>
          </TiltCard>
        )}

        {/* Monthly Verse */}
        {verses.monthly && (
          <TiltCard className={styles.verseCard}>
            <div className={styles.verseHeader}>
              <span className={styles.verseType}>Verse of the Month</span>
              <span className={styles.verseReference}>{verses.monthly.reference}</span>
            </div>
            <p className={styles.verseScripture}>"{verses.monthly.scripture}"</p>
          </TiltCard>
        )}

      </div>
    </div>
  )
}
